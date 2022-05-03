import * as core from "../../core/core.ts";
import {
  displayHttpDiagnostics,
  getArtifactUrl,
  getDownloadHeaders,
  getExponentialRetryTimeInMilliseconds,
  getFileSize,
  isRetryableStatusCode,
  isSuccessStatusCode,
  isThrottledStatusCode,
  rmFile,
  sleep,
  tryGetRetryAfterValueTimeInMilliseconds,
} from "./utils.ts";
import { StatusReporter } from "./status-reporter.ts";
import { ListArtifactsResponse, QueryArtifactResponse } from "./contracts.ts";
import { HttpManager } from "./http-manager.ts";
import { DownloadItem } from "./download-specification.ts";
import {
  getDownloadFileConcurrency,
  getRetryLimit,
} from "./config-variables.ts";
import { retryHttpClientRequest } from "./requestUtils.ts";

export class DownloadHttpClient {
  // http manager is used for concurrent connections when downloading multiple files at once
  private downloadHttpManager: HttpManager;
  private statusReporter: StatusReporter;

  constructor() {
    this.downloadHttpManager = new HttpManager(
      getDownloadFileConcurrency(),
      "@actions/artifact-download",
    );
    // downloads are usually significantly faster than uploads so display status information every second
    this.statusReporter = new StatusReporter(1000);
  }

  /**
   * Gets a list of all artifacts that are in a specific container
   */
  async listArtifacts(): Promise<ListArtifactsResponse> {
    const artifactUrl = getArtifactUrl();

    // use the first client from the httpManager, `keep-alive` is not used so the connection will close immediately
    const client = this.downloadHttpManager.getClient(0);
    const headers = getDownloadHeaders("application/json");
    const response = await retryHttpClientRequest(
      "List Artifacts",
      async () => await client(artifactUrl, { headers }),
    );
    return await response.json();
  }

  /**
   * Fetches a set of container items that describe the contents of an artifact
   * @param artifactName the name of the artifact
   * @param containerUrl the artifact container URL for the run
   */
  async getContainerItems(
    artifactName: string,
    containerUrl: string,
  ): Promise<QueryArtifactResponse> {
    // the itemPath search parameter controls which containers will be returned
    const resourceUrl = new URL(containerUrl);
    resourceUrl.searchParams.append("itemPath", artifactName);

    // use the first client from the httpManager, `keep-alive` is not used so the connection will close immediately
    const client = this.downloadHttpManager.getClient(0);
    const headers = getDownloadHeaders("application/json");
    const response = await retryHttpClientRequest(
      "Get Container Items",
      async () => await client(`${resourceUrl}`, { headers }),
    );
    return await response.json();
  }

  /**
   * Concurrently downloads all the files that are part of an artifact
   * @param downloadItems information about what items to download and where to save them
   */
  async downloadSingleArtifact(downloadItems: DownloadItem[]): Promise<void> {
    const DOWNLOAD_CONCURRENCY = getDownloadFileConcurrency();
    // limit the number of files downloaded at a single time
    core.debug(`Download file concurrency is set to ${DOWNLOAD_CONCURRENCY}`);
    const parallelDownloads = [...new Array(DOWNLOAD_CONCURRENCY).keys()];
    let currentFile = 0;
    let downloadedFiles = 0;

    core.info(
      `Total number of files that will be downloaded: ${downloadItems.length}`,
    );

    this.statusReporter.setTotalNumberOfFilesToProcess(downloadItems.length);
    this.statusReporter.start();

    await Promise.all(
      parallelDownloads.map(async (index) => {
        while (currentFile < downloadItems.length) {
          const currentFileToDownload = downloadItems[currentFile];
          currentFile += 1;

          const startTime = performance.now();
          await this.downloadIndividualFile(
            index,
            currentFileToDownload.sourceLocation,
            currentFileToDownload.targetPath,
          );

          if (core.isDebug()) {
            core.debug(
              `File: ${++downloadedFiles}/${downloadItems.length}. ${currentFileToDownload.targetPath} took ${
                (performance.now() - startTime).toFixed(
                  3,
                )
              } milliseconds to finish downloading`,
            );
          }

          this.statusReporter.incrementProcessedCount();
        }
      }),
    )
      .catch((error) => {
        throw new Error(`Unable to download the artifact: ${error}`);
      })
      .finally(() => {
        this.statusReporter.stop();
        // safety dispose all connections
        this.downloadHttpManager.disposeAndReplaceAllClients();
      });
  }

  /**
   * Downloads an individual file
   * @param httpClientIndex the index of the http client that is used to make all of the calls
   * @param artifactLocation origin location where a file will be downloaded from
   * @param downloadPath destination location for the file being downloaded
   */
  private async downloadIndividualFile(
    httpClientIndex: number,
    artifactLocation: string,
    downloadPath: string,
  ): Promise<void> {
    let retryCount = 0;
    const retryLimit = getRetryLimit();
    let destinationStream =
      (await Deno.open(downloadPath, { write: true, create: true })).writable;

    const headers = getDownloadHeaders("application/json", true, true);

    // a single GET request is used to download a file
    const makeDownloadRequest = async (): Promise<Response> => {
      const client = this.downloadHttpManager.getClient(httpClientIndex);
      return await client(artifactLocation, { headers });
    };

    // check the response headers to determine if the file was compressed using gzip
    const isGzip = (incomingHeaders: Headers): boolean => {
      return incomingHeaders.get("content-encoding") === "gzip";
    };

    // Increments the current retry count and then checks if the retry limit has been reached
    // If there have been too many retries, fail so the download stops. If there is a retryAfterValue value provided,
    // it will be used
    const backOff = async (retryAfterValue?: number): Promise<void> => {
      retryCount++;
      if (retryCount > retryLimit) {
        return Promise.reject(
          new Error(
            `Retry limit has been reached. Unable to download ${artifactLocation}`,
          ),
        );
      } else {
        this.downloadHttpManager.disposeAndReplaceClient(httpClientIndex);
        if (retryAfterValue) {
          // Back off by waiting the specified time denoted by the retry-after header
          core.info(
            `Backoff due to too many requests, retry #${retryCount}. Waiting for ${retryAfterValue} milliseconds before continuing the download`,
          );
          await sleep(retryAfterValue);
        } else {
          // Back off using an exponential value that depends on the retry count
          const backoffTime = getExponentialRetryTimeInMilliseconds(retryCount);
          core.info(
            `Exponential backoff for retry #${retryCount}. Waiting for ${backoffTime} milliseconds before continuing the download`,
          );
          await sleep(backoffTime);
        }
        core.info(
          `Finished backoff for retry #${retryCount}, continuing with download`,
        );
      }
    };

    const isAllBytesReceived = (
      expected?: string,
      received?: number,
    ): boolean => {
      // be lenient, if any input is missing, assume success, i.e. not truncated
      if (
        !expected ||
        !received ||
        Deno.env.get("ACTIONS_ARTIFACT_SKIP_DOWNLOAD_VALIDATION")
      ) {
        core.info("Skipping download validation.");
        return true;
      }

      return parseInt(expected) === received;
    };

    const resetDestinationStream = async (
      fileDownloadPath: string,
    ): Promise<void> => {
      destinationStream.close();
      await rmFile(fileDownloadPath);
      destinationStream =
        (await Deno.open(fileDownloadPath, { write: true, create: true }))
          .writable;
    };

    // keep trying to download a file until a retry limit has been reached
    while (retryCount <= retryLimit) {
      let response: Response;
      try {
        response = await makeDownloadRequest();
      } catch (error) {
        // if an error is caught, it is usually indicative of a timeout so retry the download
        core.info("An error occurred while attempting to download a file");
        // eslint-disable-next-line no-console
        console.log(error);

        // increment the retryCount and use exponential backoff to wait before making the next request
        await backOff();
        continue;
      }

      let forceRetry = false;
      if (isSuccessStatusCode(response.status)) {
        // The body contains the contents of the file however calling response.readBody() causes all the content to be converted to a string
        // which can cause some gzip encoded data to be lost
        // Instead of using response.readBody(), response.message is a readableStream that can be directly used to get the raw body contents
        try {
          const isGzipped = isGzip(response.headers);
          await this.pipeResponseToFile(response, destinationStream, isGzipped);

          if (
            isGzipped ||
            isAllBytesReceived(
              response.headers.get("content-length") ?? undefined,
              await getFileSize(downloadPath),
            )
          ) {
            return;
          } else {
            forceRetry = true;
          }
        } catch (_error) {
          // retry on error, most likely streams were corrupted
          forceRetry = true;
        }
      }

      if (forceRetry || isRetryableStatusCode(response.status)) {
        core.info(
          `A ${response.status} response code has been received while attempting to download an artifact`,
        );
        resetDestinationStream(downloadPath);
        // if a throttled status code is received, try to get the retryAfter header value, else differ to standard exponential backoff
        isThrottledStatusCode(response.status)
          ? await backOff(
            tryGetRetryAfterValueTimeInMilliseconds(response.headers),
          )
          : await backOff();
      } else {
        // Some unexpected response code, fail immediately and stop the download
        displayHttpDiagnostics(response);
        return Promise.reject(
          new Error(
            `Unexpected http ${response.status} during download for ${artifactLocation}`,
          ),
        );
      }
    }
  }

  /**
   * Pipes the response from downloading an individual file to the appropriate destination stream while decoding gzip content if necessary
   * @param response the http response received when downloading a file
   * @param destinationStream the stream where the file should be written to
   * @param isGzip a boolean denoting if the content is compressed using gzip and if we need to decode it
   */
  async pipeResponseToFile(
    response: Response,
    destinationStream: WritableStream<Uint8Array>,
    isGzip: boolean,
  ): Promise<void> {
    if (isGzip) {
      const gunzip = new DecompressionStream("gzip");

      try {
        await response.body!.pipeThrough(gunzip)
          .pipeTo(destinationStream);
      } catch (error) {
        core.error(
          `An error occurred while attempting to read/decompress the response stream`,
        );
        destinationStream.close();
        throw error;
      }
    } else {
      try {
        await response.body!.pipeTo(destinationStream);
      } catch (error) {
        core.error(
          `An error occurred while attempting to read the response stream`,
        );
        await destinationStream.close();
        throw error;
      }
    }
  }
}

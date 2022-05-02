import { UploadOptions } from "./internal/upload-options.ts";
import { UploadResponse } from "./internal/upload-response.ts";
import { DownloadOptions } from "./internal/download-options.ts";
import { DownloadResponse } from "./internal/download-response.ts";
import {
  ArtifactClient,
  DefaultArtifactClient,
} from "./internal/artifact-client.ts";

export type {
  ArtifactClient,
  DownloadOptions,
  DownloadResponse,
  UploadOptions,
  UploadResponse,
};

/**
 * Constructs an ArtifactClient
 */
export function create(): ArtifactClient {
  return DefaultArtifactClient.create();
}

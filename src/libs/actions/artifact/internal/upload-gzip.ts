import { Buffer } from "io";

/**
 * GZipping certain files that are already compressed will likely not yield further size reductions. Creating large temporary gzip
 * files then will just waste a lot of time before ultimately being discarded (especially for very large files).
 * If any of these types of files are encountered then on-disk gzip creation will be skipped and the original file will be uploaded as-is
 */
const gzipExemptFileExtensions = [
  ".gzip",
  ".zip",
  ".tar.lz",
  ".tar.gz",
  ".tar.bz2",
  ".7z",
];

/**
 * Creates a Gzip compressed file of an original file at the provided temporary filepath location
 * @param {string} originalFilePath filepath of whatever will be compressed. The original file will be unmodified
 * @param {string} tempFilePath the location of where the Gzip file will be created
 * @returns the size of gzip file that gets created
 */
export async function createGZipFileOnDisk(
  originalFilePath: string,
  tempFilePath: string,
): Promise<number> {
  for (const gzipExemptExtension of gzipExemptFileExtensions) {
    if (originalFilePath.endsWith(gzipExemptExtension)) {
      // return a really large number so that the original file gets uploaded
      return Number.MAX_SAFE_INTEGER;
    }
  }

  const input = await Deno.open(originalFilePath, { read: true });
  const output = await Deno.open(tempFilePath, { write: true, create: true });
  const gzip = new CompressionStream("gzip");

  let fileSize;

  try {
    await input.readable.pipeThrough(gzip)
      .pipeTo(output.writable);

    const stats = await output.stat();
    fileSize = stats.size;
  } finally {
    input.close();
    output.close();
  }

  return fileSize;
}

/**
 * Creates a GZip file in memory using a buffer. Should be used for smaller files to reduce disk I/O
 * @param originalFilePath the path to the original file that is being GZipped
 * @returns a buffer with the GZip file
 */
export async function createGZipFileInBuffer(
  originalFilePath: string,
): Promise<Buffer> {
  const input = await Deno.open(originalFilePath, { read: true });
  const gzip = new CompressionStream("gzip");
  try {
    const reader = input.readable.pipeThrough(gzip).getReader();
    const buffer = new Buffer();

    while (true) {
      const result = await reader.read();
      if (result.done) break;
      await buffer.write(result.value);
    }

    return buffer;
  } finally {
    input.close();
  }
}

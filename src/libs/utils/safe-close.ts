export function closeSafe(resource: { rid: number }) {
  try {
    Deno.close(resource.rid);
  } catch (_) {
    // https://github.com/denoland/deno/issues/14210
  }
}

export async function closeStreamSafe(stream: WritableStream) {
  try {
    await stream.close();
  } catch (_) {
    // safe
  }
}

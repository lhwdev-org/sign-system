import { create as createArtifactClient } from "./utils/artifact/artifact-client.ts";

const artifactClient = createArtifactClient();
await Deno.writeTextFile("hello-world.txt", "hello, world!");
await artifactClient.uploadArtifact(
  "hello-world",
  ["hello-world.txt"],
  ".",
  { retentionDays: 1 },
);

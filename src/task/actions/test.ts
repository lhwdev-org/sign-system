import { create as createArtifactClient } from "../../libs/actions/artifact/artifact-client.ts";

const artifactClient = createArtifactClient();
await Deno.writeTextFile("hello-world.txt", "hello, world!");
await artifactClient.uploadArtifact(
  "hello-world",
  ["hello-world.txt"],
  ".",
  { retentionDays: 1 },
);

import { create as createArtifactClient } from "./utils/artifact/artifact-client.ts";
import * as core from "./utils/core/core.ts";

// deno-lint-ignore require-await
await core.group("Env", async () => {
  console.log(Object.keys(Deno.env.toObject()));
});

const artifactClient = createArtifactClient();
await Deno.writeTextFile("hello-world.txt", "hello, world!");
await artifactClient.uploadArtifact(
  "hello-world",
  ["hello-world.txt"],
  ".",
  { retentionDays: 1 },
);

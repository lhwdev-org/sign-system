import { create as createArtifactClient } from "../../libs/actions/artifact/artifact-client.ts";
import * as core from "../../libs/actions/core/core.ts";

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

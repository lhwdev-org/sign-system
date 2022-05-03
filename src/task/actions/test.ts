import { create as createArtifactClient } from "./utils/artifact/artifact-client.ts";
import * as core from "./utils/core/core.ts";

// deno-lint-ignore require-await
await core.group("Env", async () => {
  for (const [key, value] of Object.entries(Deno.env.toObject())) {
    if (key.toLowerCase().includes("token")) {
      console.log(`${key}=(token)`);
    }
    console.log(`${key}=${value.slice(0, 8)}`);
  }
});

const artifactClient = createArtifactClient();
await Deno.writeTextFile("hello-world.txt", "hello, world!");
await artifactClient.uploadArtifact(
  "hello-world",
  ["hello-world.txt"],
  ".",
  { retentionDays: 1 },
);

// deno-lint-ignore-file no-explicit-any
import { Octokit } from "../core/index.ts";

import { iterator } from "./iterator.ts";
import {
  MapFunction,
  PaginationResults,
  RequestInterface,
  RequestParameters,
  Route,
} from "./types.ts";

export function paginate(
  octokit: Octokit,
  route: Route | RequestInterface,
  parameters?: RequestParameters,
  mapFn?: MapFunction,
) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(
    octokit,
    [],
    iterator(octokit, route, parameters)[
      Symbol.asyncIterator
    ]() as AsyncIterableIterator<any>,
    mapFn,
  );
}

function gather(
  octokit: Octokit,
  results: PaginationResults,
  iterator: AsyncIterableIterator<any>,
  mapFn?: MapFunction,
): Promise<PaginationResults> {
  return iterator.next().then((result) => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;
    function done() {
      earlyExit = true;
    }

    results = results.concat(
      mapFn ? mapFn(result.value, done) : result.value.data,
    );

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

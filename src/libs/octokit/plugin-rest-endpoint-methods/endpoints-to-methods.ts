import { Octokit } from "../core/index.ts";
import {
  EndpointOptions,
  RequestMethod,
  RequestParameters,
  Route,
  Url,
} from "../types/index.ts";
import {
  EndpointDecorations,
  EndpointsDefaultsAndDecorations,
} from "./types.ts";
import { RestEndpointMethods } from "./generated/method-types.ts";

type EndpointMethods = {
  [methodName: string]: typeof Octokit.prototype.request;
};

export function endpointsToMethods(
  octokit: Octokit,
  endpointsMap: EndpointsDefaultsAndDecorations,
) {
  // deno-lint-ignore ban-types
  const newMethods = {} as { [key: string]: object };

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /) as [RequestMethod, Url];
      const endpointDefaults: EndpointOptions = Object.assign(
        { method, url },
        defaults,
      );

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope] as EndpointMethods;

      if (decorations) {
        scopeMethods[methodName] = decorate(
          octokit,
          scope,
          methodName,
          endpointDefaults,
          decorations,
        );
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods as RestEndpointMethods;
}

function decorate(
  octokit: Octokit,
  scope: string,
  methodName: string,
  defaults: EndpointOptions,
  decorations: EndpointDecorations,
) {
  const requestWithDefaults = octokit.request.defaults(defaults);

  /* istanbul ignore next */
  function withDecorations(
    ...args: [Route, RequestParameters?] | [EndpointOptions]
  ) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args);

    // There are currently no other decorations than `.mapToData`
    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined,
      });
      return requestWithDefaults(options);
    }

    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(
        `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`,
      );
    }
    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }

    if (decorations.renamedParameters) {
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
      const options = requestWithDefaults.endpoint.merge(...args);

      for (
        const [name, alias] of Object.entries(
          decorations.renamedParameters,
        )
      ) {
        if (name in options) {
          octokit.log.warn(
            `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`,
          );
          if (!(alias in options)) {
            options[alias] = options[name];
          }
          delete options[name];
        }
      }
      return requestWithDefaults(options);
    }

    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    return requestWithDefaults(...args);
  }
  return Object.assign(withDecorations, requestWithDefaults);
}

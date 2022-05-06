import {
  PaginatingEndpoints,
  paginatingEndpoints,
} from "./generated/paginating-endpoints.ts";

export { paginatingEndpoints } from "./generated/paginating-endpoints.ts";

export function isPaginatingEndpoint(
  arg: unknown,
): arg is keyof PaginatingEndpoints {
  if (typeof arg === "string") {
    return paginatingEndpoints.includes(arg as keyof PaginatingEndpoints);
  } else {
    return false;
  }
}

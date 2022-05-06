import { paginate } from "./paginate.ts";
import { iterator } from "./iterator.ts";

import { ComposePaginateInterface } from "./types.ts";

export const composePaginateRest = Object.assign(paginate, {
  iterator,
}) as ComposePaginateInterface;

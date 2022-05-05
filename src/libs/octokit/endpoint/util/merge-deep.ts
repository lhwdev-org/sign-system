// deno-lint-ignore-file no-explicit-any ban-types
import { isPlainObject } from "../../util/is-plain-object.ts";

export function mergeDeep(defaults: any, options: any): object {
  const result: any = Object.assign({}, defaults);

  Object.entries(options).forEach(([key, value]) => {
    if (isPlainObject(value)) {
      if (!(key in defaults)) Object.assign(result, { [key]: value });
      else result[key] = mergeDeep((defaults as any)[key], value);
    } else {
      Object.assign(result, { [key]: value });
    }
  });

  return result;
}

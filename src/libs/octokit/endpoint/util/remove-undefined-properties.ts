// deno-lint-ignore-file no-explicit-any
export function removeUndefinedProperties(obj: any): any {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

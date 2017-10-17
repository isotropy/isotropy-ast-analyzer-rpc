export function createCollection(source) {
  return { ...source };
}

export function wsPost(source, procedure, args = null) {
  if (args) return { type: "post", ...source, ...procedure, ...args };
  return { type: "post", ...source, ...procedure };
}

export function createCollection(source) {
  return { ...source };
}

export function rpcPost(source, procedure, args = null) {
  if (args) return { type: "post", ...source, ...procedure, ...args };
  return { type: "post", ...source, ...procedure };
}

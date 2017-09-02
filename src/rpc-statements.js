export function createCollection(source) {
  return { type: "rpc", ...source }
}

export function createRPC(source, procedure, args = null) {
  if (args) return ({ ...source, ...procedure, ...args })
  return ({ ...source, ...procedure })
}

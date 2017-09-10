export function createCollection(source) {
  return { ...source };
}

export function createMemberExpression(node) {
  return { type: "MemberExpression", ...node }
}

export function rpcPost(source, procedure, args = null) {
  if (args) return { type: "rpc_post", ...source, ...procedure, ...args };
  return { type: "rpc_post", ...source, ...procedure };
}

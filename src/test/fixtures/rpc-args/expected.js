module.exports = {
  type: "rpc_post",
  collectionArray: ["postsAPI"],
  identifier: "myServer",
  module: "todosServerModule",
  function: "getTodosOf",
  args: { type: "Identifier", name: "id" }
};

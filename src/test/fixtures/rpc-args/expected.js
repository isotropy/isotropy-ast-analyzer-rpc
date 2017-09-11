module.exports = {
  type: "rpc_post",
  collection: "postsAPI",
  identifier: "myServer",
  module: "todosServerModule",
  function: "getTodosOf",
  args: { type: "Identifier", name: "id" }
};

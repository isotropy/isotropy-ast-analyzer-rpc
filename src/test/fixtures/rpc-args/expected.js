module.exports = {
  type: "rpc",
  module: "todosServerModule",
  identifier: "myServer",
  collection: "postsAPI",
  procedure: "getTodosOf",
  args: {
    type: "Identifier",
    name: "id"
  }
};

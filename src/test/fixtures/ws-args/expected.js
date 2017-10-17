module.exports = {
  type: "post",
  collection: "postsAPI",
  identifier: "myServer",
  module: "http://www.poe3.com",
  function: "getTodosOf",
  args: { type: "Identifier", name: "id" }
};

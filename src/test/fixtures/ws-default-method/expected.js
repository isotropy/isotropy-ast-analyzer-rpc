module.exports = {
  remoteUrl: "http://www.poe3.com",
  identifier: "server",
  httpMethod: "get",
  expressions: [
    { type: "MemberExpression", memberName: "getAllTodos" },
    {
      type: "CallExpression",
      arguments: [
        { type: "NumericLiteral", value: 1 },
        { name: "a", type: "Identifier" }
      ]
    }
  ]
};

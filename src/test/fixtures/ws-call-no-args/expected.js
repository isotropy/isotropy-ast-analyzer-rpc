module.exports = {
  remoteUrl: "http://www.poe3.com",
  identifier: "$post",
  httpMethod: "post",
  expressions: [
    { type: "MemberExpression", memberName: "getAllTodos" },
    { type: "CallExpression", arguments: [] }
  ]
};

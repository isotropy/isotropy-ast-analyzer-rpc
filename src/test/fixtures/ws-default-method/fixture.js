import server from "../../server/my-server";

async function getAllTodos() {
  const a = 10;
  return await server.getAllTodos(1, a);
}

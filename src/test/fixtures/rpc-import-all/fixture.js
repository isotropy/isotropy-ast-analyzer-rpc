import * as myServer from "../../server/my-server";

async function getAllTodos() {
  return await myServer.postsAPI.getAllTodos();
}

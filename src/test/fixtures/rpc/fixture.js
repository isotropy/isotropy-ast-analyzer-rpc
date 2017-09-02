import * as myServer from "../my-server";

async function getAllTodos() {
  return await myServer.postsAPI.getAllTodos();
}

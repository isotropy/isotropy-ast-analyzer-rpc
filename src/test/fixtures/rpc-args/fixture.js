import * as myServer from "../../server/my-server";

async function getTodosOf(id = "0x8902") {
  return await myServer.postsAPI.getTodosOf(id);
}

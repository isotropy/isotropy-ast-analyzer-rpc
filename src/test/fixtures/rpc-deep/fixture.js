import * as myServer from "../my-server";

async function getAllDones() {
  return await myServer.legacyServer.backUpLogs.postsAPI.getAllDones();
}

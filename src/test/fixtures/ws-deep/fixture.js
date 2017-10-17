import * as myServer from "../../server/my-server";

async function getAllDones() {
  return await myServer.legacyServer.backUpLogs.postsAPI.getAllDones();
}

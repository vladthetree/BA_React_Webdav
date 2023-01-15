import { createClient } from "webdav";

//dockerServer
export const client = createClient("https://localhost:8443/remote.php/dav/files/test/", {
  username: "test",
  password: "12345"
});

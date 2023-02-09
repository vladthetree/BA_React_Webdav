import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { createClient } from "webdav";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; //https workaround

app.use(express.static(path.join(__dirname, "..", "dist")));

const filter = (pathname, req) => {
  return (
    pathname.startsWith("http://localhost:8080/proxy/listContent") ||
    pathname.startsWith("http://localhost:8080/proxy/getFileContent")
  );
};

const options = {
  target: "http://localhost:8080/remote.php/",
  changeOrigin: true,
  secure: false,
  rejectUnauthorized: false,
};

const proxy = createProxyMiddleware(filter, options);
app.use(proxy);

app.post("/proxy/listContent", async (req, res) => {
  try {
    const { username, password, targetUrl } = req.body;
    const client = createClient(targetUrl, {
      username: username,
      password: password,
    });
    const content = await client.getDirectoryContents("/");
    const contentNames = content
      .filter((files) => files.filename.includes("mp4"))
      .map((mp4Files) => ({ filename: mp4Files.filename.slice(1) }));
    res.json(contentNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error : Credentials" });
  }
});

app.post("/proxy/getFileContent", async (req, res) => {
  let result = [];
  try {
    const { username, password, targetUrl, newFiles } = req.body;
    console.log("NEW FILES");
    console.log(newFiles);
    const client = createClient(targetUrl, {
      username: username,
      password: password,
    });

    console.log(" NEW FILES ");
    console.log(newFiles);
    const promises = newFiles.map((file, index) =>
      client.getFileContents(file.filename).then((arrayBuffer) => {
        result.push({ name: file.filename, buffer: arrayBuffer });
      })
    );
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
    res.send(error);
  }

  console.log("DOWNLOAD RESULT");
  console.log(result);

  res.send(result);
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

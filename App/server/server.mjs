import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { createClient } from "webdav";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import https from "https";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const server = express();

server.use(express.json());

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; //https workaround
const PORT_SERVER = 8081;
const PORT_RESIDENT_A = 8082;
const PORT_RESIDENT_B = 8083;
const PORT_RESIDENT_C = 8084;
const PORT_ADMINISTRATION = 8091;

const filter = (pathname, req, port) => {
  return (
    pathname.startsWith(`http://localhost:${port}/proxy/listContent`) ||
    pathname.startsWith(`http://localhost:${port}/proxy/getFileContent`)
  );
};

const proxyTargets = {
  8082: {
    target: "http://localhost:8082/remote.php/",
  },
  8083: {
    target: "http://localhost:8083/remote.php/",
  },
  8084: {
    target: "http://localhost:8084/remote.php/",
  },
};

const proxyOptions = {
  changeOrigin: true,
  secure: false,
  rejectUnauthorized: false,
};

const proxy = (port) =>
  createProxyMiddleware((pathname, req) => filter(pathname, req, port), {
    ...proxyTargets[port],
    ...proxyOptions,
  });

server.use(proxy(8082));
server.use(proxy(8083));
server.use(proxy(8084));
server.use(cors());

server.post("/proxy/listContent", async (req, res) => {
  try {
    const { username, password, targetUrl } = req.body;
    const client = createClient(targetUrl, {
      username: username,
      password: password,
    });
    const content = await client.getDirectoryContents("/");
    const filteredContent = content.reduce((result, file) => {
      if (file.filename.includes("mp4") || file.filename.includes("json")) {
        result.push({
          filename: file.filename.slice(1),
          lastmod: file.lastmod,
        });
      }
      return result;
    }, []);
    res.json(filteredContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error : Credentials" });
  }
});

server.post("/proxy/getFileContent", async (req, res) => {
  let result = [];
  try {
    const { username, password, targetUrl, newFiles } = req.body;
    const client = createClient(targetUrl, {
      username: username,
      password: password,
    });
    console.log("NEW FILES");
    console.log(newFiles);
    const promises = newFiles.map((file, index) =>
      client.getFileContents(file.filename).then((arrayBuffer) => {
        result.push({
          name: file.filename,
          date: file.lastmod,
          buffer: arrayBuffer,
        });
      })
    );
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
  res.send(result);
});

server.listen(PORT_SERVER, () => {
  console.log(`SERVER is listening on port ${PORT_SERVER}`);
});

const residentAppA = express();
residentAppA.use(
  express.static(path.join(__dirname, "..", "dist", "resident"))
);

residentAppA.listen(PORT_RESIDENT_A, () => {
  console.log(`RESIDENT_B is listening on port ${PORT_RESIDENT_A}`);
});

//#################################
//SELF CERT SOLUTION
//  const residentAppA = express();
//  const options = {
//    key: fs.readFileSync(__dirname + "/crt/residentA/key.pem"),
//    cert: fs.readFileSync(__dirname + "/crt/residentA/cert.pem"),
//  };
//  residentAppA.use(
//    express.static(path.join(__dirname, "..", "dist", "resident"))
//  );
//  https.createServer(options, residentAppA).listen(PORT_RESIDENT_A, () => {
//    console.log(`RESIDENT_A is listening on port ${PORT_RESIDENT_A}`);
//  });
//#################################

// const residentAppB = express();
// residentAppB.use(
//   express.static(path.join(__dirname, "..", "dist", "resident"))
// );

// residentAppB.listen(PORT_RESIDENT_B, () => {
//   console.log(`RESIDENT_B is listening on port ${PORT_RESIDENT_B}`);
// });

// const residentAppC = express();
// residentAppC.use(
//   express.static(path.join(__dirname, "..", "dist", "resident"))
// );

// residentAppC.listen(PORT_RESIDENT_C, () => {
//   console.log(`RESIDENT_C is listening on port ${PORT_RESIDENT_C}`);
// });

const administration = express();

administration.use(
  express.static(path.join(__dirname, "..", "dist", "administration"))
);
administration.listen(PORT_ADMINISTRATION, () => {
  console.log(`ADMINISTRATION is listening on port ${PORT_ADMINISTRATION}`);
});

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { createClient } from 'webdav';
import { createProxyMiddleware } from 'http-proxy-middleware';
import WebSocket from 'ws';

const __dirname = dirname(fileURLToPath(import.meta.url));
const server = express();

server.use(express.json());

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; //https workaround
const PORT_SERVER = 8081;
const PORT_RESIDENT_A = 8082;
const PORT_RESIDENT_B = 8083;
const PORT_RESIDENT_C = 8084;
const PORT_ADMINISTRATION = 8091;
const DEMO_IP = '192.168.43.100';
const LOCALHOST = 'localhost';
let busy = false;

const filter = (pathname, req, port) => {
  return (
    pathname.startsWith(`http://${LOCALHOST}:${port}/proxy/listContent`) ||
    pathname.startsWith(`http://${LOCALHOST}:${port}/proxy/getFileContent`)
    // pathname.startsWith(`http://localhost:${port}/proxy/listContent`) ||
    // pathname.startsWith(`http://localhost:${port}/proxy/getFileContent`)
  );
};

const proxyTargets = {
  8082: {
    target: `http://${LOCALHOST}:8082/remote.php/`,
    ws: true, // enable WebSocket proxying for this target
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
      proxyReq.setHeader('X-Special-Header', 'WebSocket');
    },
    // target: `http://localhost:8082/remote.php/`,
    // ws: true, // enable WebSocket proxying for this target
    // onProxyReqWs: (proxyReq, req, socket, options, head) => {
    //   proxyReq.setHeader("X-Special-Header", "WebSocket");
    // },
  },
  8083: {
    target: 'http://localhost:8083/remote.php/',
    ws: true, // enable WebSocket proxying for this target
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
      proxyReq.setHeader('X-Special-Header', 'WebSocket');
    },
  },
  8084: {
    target: 'http://localhost:8084/remote.php/',
  },
};

const proxyOptions = {
  changeOrigin: true,
  secure: false,
  rejectUnauthorized: false,
};

const proxy = port =>
  createProxyMiddleware((pathname, req) => filter(pathname, req, port), {
    ...proxyTargets[port],
    ...proxyOptions,
  });

server.use(proxy(8082));
server.use(proxy(8083));
server.use(proxy(8084));
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Filename');

  next();
});

server.post('/proxy/listContent', async (req, res) => {
  try {
    const { username, password, targetUrl } = req.body;
    const client = createClient(targetUrl, {
      username: username,
      password: password,
    });
    const content = await client.getDirectoryContents('/');
    const filteredContent = content.reduce((result, file) => {
      if (file.filename.includes('mp4') || file.filename.includes('json')) {
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
    res.status(500).json({ error: 'Error : Credentials' });
  }
});

const serverSocketFileContent = new WebSocket.Server({ port: 8050 });

serverSocketFileContent.on('connection', async function (clientSocket) {
  clientSocket.on('message', async function (message) {
    const messageObject = JSON.parse(message);
    if (messageObject.type === 'isServerBusy') {
      const responseMessage = {
        type: 'serverBusy',
        data: busy,
      };
      clientSocket.send(JSON.stringify(responseMessage));
    } else if (messageObject.type === 'newData') {
      const metaData = messageObject.data;
      console.log('METADATA', metaData);
      try {
        busy = true;
        const client = createClient(metaData.targetUrl, {
          username: metaData.username,
          password: metaData.password,
        });

        const fileData = [];

        for (const file of metaData.newFiles) {
          const stream = await client.createReadStream(file.filename);
          const chunks = [];

          stream.on('data', chunk => {
            chunks.push(chunk);
          });

          stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            fileData.push({
              name: file.filename,
              date: file.lastmod,
              buffer: buffer,
            });
            if (fileData.length === metaData.newFiles.length) {
              busy = false;
              const responseMessage = {
                type: 'newDataResponse',
                data: fileData,
              };
              clientSocket.send(JSON.stringify(responseMessage));
            }
          });

          stream.on('error', error => {
            console.log(`Error reading stream for file ${file.filename}: ${error}`);
          });
        }
      } catch (error) {
        console.log('Webdav-Client-Error', error);
      }
    }
  });
});

server.post('/server/getResidents', async (req, res) => {
  let result = [];
  try {
    const { username, password, targetUrl } = req.body;
    const client = createClient(targetUrl, {
      username: username,
      password: password,
    });
    await client.getDirectoryContents('/').then(files => {
      files.forEach(file => {
        if (file.basename.match(/^resident_.*/)) {
          const residentName = file.basename.replace(/^resident_/, '');
          result.push(residentName);
        }
      });
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
  console.log(result);
  res.send(result);
});

const socket = new WebSocket.Server({ port: 8051 });

socket.on('connection', socket => {
  console.log('Client connected');

  var jsonObject = null;
  socket.on('message', message => {
    const messageObject = JSON.parse(message);
    if (messageObject.type === 'userdata') {
      jsonObject = messageObject.data;
      console.log(jsonObject);

      const parallelStream = async () => {
        const client = createClient(jsonObject.targetUrl, {
          username: jsonObject.username,
          password: jsonObject.password,
        });
        const residentFull = `resident_${jsonObject.resident}`;
        const filesToDownload = await client.getDirectoryContents(`/${residentFull}`);
        const fileNameArray = filesToDownload
          .filter(file => file.filename.endsWith('.mp4'))
          .map(file => file.filename);

        socket.onmessage = event => {
          const data = JSON.parse(event.data);
          console.log(data);
        };

        fileNameArray.map(async fileName => {
          const stats = await client.stat(fileName);
          console.log(fileName);
          console.log(stats.size);
          const start = 0;
          const end = stats.size - 1;
          let streamedSize = 0;

          const fileStream = client.createReadStream(fileName, { start, end });

          let packetId = 0; // initialisiere die Paket-ID
          fileStream.on('data', data => {
            console.log(`Streaming now : ${fileName}`);
            if (socket.readyState === WebSocket.OPEN) {
              streamedSize += data.length;
              const messageObject = {
                type: 'video',
                data: {
                  fileName: fileName,
                  bufferdata: data,
                  packetId: packetId, // füge hier die eindeutige ID hinzu
                },
              };
              packetId++; // inkrementiere die Paket-ID
              socket.send(JSON.stringify(messageObject));
              const progress = Math.round((streamedSize / stats.size) * 100);
              console.log(`Streaming progress: ${progress}%`);
            }
          });
          fileStream.on('end', () => {
            if (streamedSize === stats.size) {
              console.log('Streaming complete');
            } else {
              console.log('Streaming incomplete');
            }
          });
        });
      };
      parallelStream();
    }
  });

  // Handle disconnections
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT_SERVER, () => {
  console.log(`SERVER is listening on port ${PORT_SERVER}`);
});

const residentAppA = express();
residentAppA.use(express.static(path.join(__dirname, '..', 'dist', 'resident')));

residentAppA.listen(PORT_RESIDENT_A, () => {
  console.log(`RESIDENT_B is listening on port ${PORT_RESIDENT_A}`);
});

//#################################
//SELF CERT SOLUTION
// const residentAppA = express();
// const options = {
//   key: fs.readFileSync(`${__dirname}/crt/residentA/key.pem`),
//   cert: fs.readFileSync(`${__dirname}/crt/residentA/cert.pem`),
// };
// residentAppA.use(
//   express.static(path.join(__dirname, "..", "dist", "resident"))
// );
// https.createServer(options, residentAppA).listen(PORT_RESIDENT_A, () => {
//   console.log(`RESIDENT_A is listening on port ${PORT_RESIDENT_A}`);
// });
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

administration.use(express.static(path.join(__dirname, '..', 'dist', 'administration')));
administration.listen(PORT_ADMINISTRATION, () => {
  console.log(`ADMINISTRATION is listening on port ${PORT_ADMINISTRATION}`);
});

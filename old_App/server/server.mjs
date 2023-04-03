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

const PORT_SERVER = 8081;
const PORT_RESIDENT_A = 8082;
server.post('/listContent', async (req, res) => {
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


const serverSocketFileContent = new WebSocket.Server({ port: 7443 });
serverSocketFileContent.on('connection', async function (clientSocket) {
  clientSocket.on('message', async function (message) {
    try {
      const messageObject = JSON.parse(message);

      if (messageObject.type === 'newData') {
        const metaData = messageObject.data;
        console.log('METADATA', metaData);

        const client = createClient(metaData.targetUrl, {
          username: metaData.username,
          password: metaData.password,
        });

        const fileData = [];

        for (const file of metaData.newFiles) {
          console.log("Getting read Stream for ", file.filename);
          const stream = await client.createReadStream(file.filename);
          const chunks = [];
          console.log("Stream success next  ");

          stream.on('data', chunk => {
            chunks.push(chunk);
          });

          await new Promise((resolve, reject) => {
            stream.on('end', () => {
              const buffer = Buffer.concat(chunks);
              fileData.push({
                name: file.filename,
                date: file.lastmod,
                buffer: buffer,
              });
              if (fileData.length === metaData.newFiles.length) {
                console.log("CHECK PASSED");
                if (clientSocket.readyState === WebSocket.OPEN) {
                  console.log("WebSocket is open")
                  clientSocket.send(JSON.stringify({ type: 'incomingNewData', data: fileData }));
                } else {
                  console.log('WebSocket is not open');
                }
                console.log("HAS BEEN SEND!");
                resolve();
              }
            });

            stream.on('error', error => {
              console.log(`Error reading stream for file ${file.filename}: ${error}`);
              reject(error);
            });
          });
        }
        console.log("RESOLVED! -> Closing the Socket!");
        clientSocket.close();
      }
    } catch (error) {
      console.log('Error processing message:', error);
    }
  });

  clientSocket.on('close', () => {
    console.log('Client socket closed');
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


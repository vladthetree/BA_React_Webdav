import express from 'express';
import { createClient } from 'webdav';
import WebSocket from 'ws';
import * as dotenv from 'dotenv';
dotenv.config();

const server = express();
server.use(express.json());

const PROXY_SERVER = process.env.PROXY_SERVER;

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
        const client = createClient(metaData.targetUrl, {
          username: metaData.username,
          password: metaData.password,
        });

        const fileData = [];

        for (const file of metaData.newFiles) {
          const stream = await client.createReadStream(file.filename);
          const chunks = [];
          stream.on('data', (chunk) => {
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
              if (clientSocket.readyState === WebSocket.OPEN) {
                console.log('WebSocket is open');
                clientSocket.send(
                  JSON.stringify({ type: 'incomingNewData', data: fileData }),
                );
              } else {
                console.log('WebSocket is not open');
              }
              resolve();
            });
            stream.on('error', (error) => {
              console.log(
                `Error reading stream for file ${file.filename}: ${error}`,
              );
              reject(error);
            });
          });
        }
        console.log('RESOLVED! -> Closing the Socket!');
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

server.listen(PROXY_SERVER, () => {
  console.log(`PROXY_SERVER is listening on port ${PROXY_SERVER}`);
});

// const residentAppA = express();
// residentAppA.use(
//   express.static(path.join(__dirname, '..', 'dist', 'resident')),
// );

// residentAppA.listen(PROGRESSIV_WEB_APP, () => {
//   console.log(`RESIDENT is listening on port ${PROGRESSIV_WEB_APP}`);
// });

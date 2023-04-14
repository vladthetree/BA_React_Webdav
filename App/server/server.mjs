import express from 'express';
import { createClient } from 'webdav';
import WebSocket from 'ws';
import cors from 'cors';

const PROXY_SERVER = 8082;

const server = express();

// For Dev
server.use(cors({ origin: 'http://localhost:8081' }));

server.use(express.json());

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
      let paused = false;
      if (messageObject.type === 'pause') {
        paused = true;
        let chunkIndexClient = messageObject.chunkIndex;
        console.log('----------------------PAUSE > CLIENT');
      } else if (messageObject.type === 'resume') {
        console.log('--------------RESUME');
        paused = false;
      } else if (messageObject.type === 'newData') {
        const metaData = messageObject.data;
        console.log('META DATA ARE');
        console.log(metaData);

        const client = createClient(metaData.targetUrl, {
          username: metaData.username,
          password: metaData.password,
        });

        for (const file of metaData.newFiles) {
          const stream = await client.createReadStream(file.filename, {
            highWaterMark: 64 * 1024,
          });
          const data = await client.stat(file.filename);
          console.log('data', data);
          const size = data.size;
          const chunkSize = 64 * 1024;
          const totalChunks = Math.ceil(size / chunkSize);
          console.log('size', size);
          console.log(totalChunks);

          let chunkIndex = 0;
          console.log('Start Stream for ', file.filename);
          if (clientSocket.readyState === WebSocket.OPEN) {
            stream.on('data', (chunk) => {
              paused = !clientSocket.send(
                JSON.stringify({
                  type: 'incomingNewData',
                  data: {
                    name: file.filename,
                    date: file.lastmod,
                    buffer: chunk,
                    index: chunkIndex,
                    totalChunks: totalChunks,
                  },
                }),
              );
              chunkIndex++;
              const percentComplete = (
                (chunkIndex / totalChunks) *
                100
              ).toFixed(2);
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(
                `Loading: ${file.filename} - - - ${percentComplete}%`,
              );
            });
            stream.on('end', (chunk) => {
              console.log('END OF STREAM');
              console.log('TOTAL WAS ', totalChunks);
              console.log('FILESIZE WAS ', size);
              clientSocket.send(
                JSON.stringify({
                  type: 'end',
                  data: {
                    name: file.filename,
                    totalChunks: chunkIndex,
                    byteLength: size,
                  },
                }),
              );
              console.log(' Closing the Socket!');
            });
            stream.on('error', (error) => {
              console.error(
                `Error occurred while streaming file: ${file.filename} `,
              );
              clientSocket.send(
                JSON.stringify({
                  type: 'error',
                  data: {
                    message: `Error occurred while streaming file: ${
                      file.filename + error
                    }`,
                  },
                }),
              );
              clientSocket.close();
            });
          }
        }
      }
    } catch (error) {
      console.log('Error processing message:', error);
      clientSocket.close();
    }
  });
});

server.listen(PROXY_SERVER, () => {
  console.log(`PROXY_SERVER is listening on port ${PROXY_SERVER}`);
});

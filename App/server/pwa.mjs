import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const PROGRESSIV_WEB_APP = 8081;
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

const residentAppA = express();
residentAppA.use(express.static(path.join(__dirname, '..', 'dist', 'pwa')));

residentAppA.listen(PROGRESSIV_WEB_APP, () => {
  console.log(`PROGRESSIV_WEB_APP is listening on port ${PROGRESSIV_WEB_APP}`);
});

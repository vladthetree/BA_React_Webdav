import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { createClient } from "webdav";
import { createProxyMiddleware } from "http-proxy-middleware";


const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTOCOLL = "http";
const URL = "localhost";
const PORT = 8081;

const app = express();
app.get('/dist/bundle.js', (req, res) => {
	res.set('Content-Type', 'application/javascript');
	res.set('X-Content-Type-Options', 'nosniff');
	res.sendFile(path.resolve(__dirname, 'dist', 'bundle.js'));
});
app.use(express.json());
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; //https workaround
console.log(__dirname);
app.use(express.static(path.join(__dirname, "..", "..", "dist")));

const filter = (pathname, req) => {
	return pathname.startsWith("http://localhost:8081/server/getResidents");
};

const options = {
	target: "http://localhost:8081/remote.php/",
	changeOrigin: true,
	//secure: false,
	//rejectUnauthorized: false,
};

const proxy = createProxyMiddleware(filter, options);
app.use(proxy);


app.post("/server/getResidents", async (req, res) => {
	console.log(" GET RESIDENTS ");
	let result = [];
	try {
		const { username, password, targetUrl } = req.body;
		console.log(username);
		console.log(password);
		console.log(targetUrl);
		const client = createClient(targetUrl, {
			username: username,
			password: password,
		});
		await client.getDirectoryContents("/").then((files) => {
			files.forEach((file) => {
				if (file.basename.match(/^resident_.*/)) {
					const residentName = file.basename.replace(/^resident_/, "");
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

app.post("/server/getResidentVideos", async (req, res) => {
	let result = [];

	try {
		const { username, password, targetUrl, resident } = req.body;
		const residentFull = `resident_${resident}`;
		const client = createClient(targetUrl, {
			username: username,
			password: password,
		});
		const filesToDownload = await client.getDirectoryContents(`/${residentFull}`);
		const downloadPromises = filesToDownload.map(async (file) => {
			const fileBuffer = await client.getFileContents(file.filename);
			result.push({name:file.filename, buffer:fileBuffer});
		});
		await Promise.all(downloadPromises);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error retrieving directory contents" });
	}
	console.log(result);
	res.send(result);
});


app.listen(PORT, () => {
	console.log(`Managerserver listen to ${PROTOCOLL}://${URL}:${PORT}`);
});

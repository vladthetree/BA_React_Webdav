import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { createClient } from "webdav";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; //https workaround

app.use(express.static(path.join(__dirname, "..", "dist")));



const filter = (pathname, req) => {
  return pathname.startsWith("http://localhost:8080/proxy/listContent") || pathname.startsWith("http://localhost:8080/proxy/getFileContent");
};
//https://localhost:8443/remote.php/dav/files/test/
//proxy greift nicht
const options = {
  target: "http://localhost:8080/remote.php/",
  changeOrigin: true,
  secure: false,
  rejectUnauthorized: false

};

const proxy = createProxyMiddleware(filter,options);
app.use(proxy);


app.post("/proxy/listContent", async (req, res) => {
  try {
    console.log(req.body)
    const { username, password, targetUrl } = req.body;
    console.log("LIST CONTENT SERVER 1")

    const client = createClient(targetUrl, { username:username, password:password });
    console.log(targetUrl)
    console.log("LIST CONTENT SERVER 2")
    const content = await client.getDirectoryContents("/");
    console.log(content)
    console.log("LIST CONTENT SERVER 3")
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving directory contents" });
  }
});

app.post("/proxy/getFileContent", async(req,res)=> {
  console.log(" IN GET FILE CONTENT 1")
  let result = [];
  try{
    console.log(" IN GET FILE CONTENT 2")
    const { username, password, targetUrl, newFiles } = req.body;
    console.log(newFiles)
    console.log(" IN GET FILE CONTENT 3")
    const client = createClient(targetUrl, { username:username, password:password });
    console.log(" IN GET FILE CONTENT 4")
    const promises = newFiles.map((file, index) => client.getFileContents(file.basename).then(arrayBuffer => {
      console.log(arrayBuffer)
      console.log(" IN GET FILE CONTENT 5")
          result.push({name:file.basename,buffer:arrayBuffer});
        }))
        console.log(" IN GET FILE CONTENT 6")
    await Promise.all(promises)
    console.log(" IN GET FILE CONTENT 7")
    console.log(promises)
  }catch(error){
    console.log(error)
    res.send(error)
  }
  console.log("DOWNLOAD RESULT")
  console.log(result)
  res.send(result)

})


app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

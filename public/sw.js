const username = "test";
const password = "12345";
const targetUrl = "https://localhost:8443/remote.php/dav/files/test/";
const FILES_TO_CACHE = [
  `/index.html`,
  `/css/layout.css`,
  `/css/videostyle.css`,
  `/css/login.css`
];


const CACHE_NAME = "CACHE_PRE_INSTALL";

self.addEventListener("fetch", event => {
  console.log("SOME FETCH")
});

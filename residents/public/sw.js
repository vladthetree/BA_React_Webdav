

// self.addEventListener("fetch", (event) => {
//   console.log("ORIGINAL HEADER")
//   console.log( event.request.headers);
//   console.log(" SERVICE WORKER FETCH")
//   console.log(event)
//   const request = event.request;
//   if (
//     request.url.startsWith(
//       targetUrl
//     )
//   ) {
//     console.log(" REQUEST TO TARGET URL : INSIDE IF")
//     event.respondWith(
//       fetch(request.url, {

//         mode: "cors",

//         headers: {
//           Authorization: "Basic " + btoa(`${username}:${password}`)
//         }
//       }).then(response => {
//         console.log("FETCH RESPONSE")
//         console.log(response);
//         return response;
//       })
//     );
//   } else {
//     event.respondWith(fetch(request));
//   }
// });

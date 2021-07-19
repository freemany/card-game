const server = require("express")();
const http = require("http").createServer(server);
const io = require("socket.io")(http);

io.on("connection", (client) => {
  console.log("user connected: " + client.id);

  client.on("disconnect", () => {
    console.log("user disconnected: " + client.id);
  });
});

http.listen(3000, () => {
  console.log("server started");
});

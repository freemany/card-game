const server = require("express")();
const http = require("http").createServer(server);
const io = require("socket.io")(http);

const players = { A: null, B: null };
const playerSideMap = {};

console.log(playerSideMap, players);

const setSide = (client) => {
  for (const side in players) {
    if (!players[side] && side) {
      client.emit("setSide", side);
      players[side] = client.id;
      return;
    }
  }
  client.emit("setSide", null);
};
const onDrop = (client) => {
  client.on("dropCard", (data) => {
    client.broadcast.emit("otherDropCard", data);
  });
};

io.on("connection", (client) => {
  console.log("user connected: " + client.id);
  // client.disconnect();

  client.on("room", (room) => {
    console.log("my room: " + room);
    client.emit("roomJoined", "You have joined Room " + room);
  });

  setSide(client);
  onDrop(client);

  client.on("action", () => {});

  client.on("disconnect", () => {
    console.log("user disconnected: " + client.id);
    players[playerSideMap[client.id]] = null;
    delete playerSideMap[client.id];
    console.log(players, playerSideMap);
  });
});

http.listen(3000, () => {
  console.log("server started");
});

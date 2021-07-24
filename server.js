const server = require("express")();
const http = require("http").createServer(server);
const io = require("socket.io")(http);

const players = { A: null, B: null };
const playerSideMap = {};
const playerRoomMap = {};

let first = true;

console.log(playerSideMap, players);

const onScores = (client) => {
  client.on("scores", (scores) => {
    client.broadcast.to(playerRoomMap[client.id]).emit("scores", {
      action: "sendScores",
      side: "B",
      data: scores,
    });
  });
};

const setSide = (client) => {
  for (const side in players) {
    if (!players[side] && side) {
      client.emit("setSide", side);
      players[side] = client.id;
      playerSideMap[client.id] = side;
      return;
    }
  }
  client.emit("setSide", null);
};
const onDrop = (client) => {
  client.on("dropCard", (data) => {
    client.broadcast.to(playerRoomMap[client.id]).emit("otherDropCard", data);
  });
};
const onDealedCards = (client) => {
  client.on("dealedCards", (data) => {
    client.broadcast.to(playerRoomMap[client.id]).emit("dealedCards", data);
  });
};
const onBattle = (client) => {
  client.on("battle", (data) => {
    client.broadcast.to(playerRoomMap[client.id]).emit("battle", data);
  });
};
const onClear = (client) => {
  client.on("clear", (data) => {
    client.broadcast.to(playerRoomMap[client.id]).emit("clear", data);
  });
};

io.on("connection", (client) => {
  console.log("user connected: " + client.id);

  client.on("room", (room) => {
    console.log("my room: " + room);
    client.emit("roomJoined", "You have joined Room " + room);
    playerRoomMap[client.id] = room;
    client.join(room);
    setSide(client);
  });

  onDrop(client);
  onDealedCards(client);
  onScores(client);
  onBattle(client);
  onClear(client);

  client.on("disconnect", () => {
    console.log("user disconnected: " + client.id);
    console.log(players, playerSideMap);
    if (playerSideMap[client.id]) {
      players[playerSideMap[client.id]] = null;
      delete playerSideMap[client.id];
    }
    console.log(players, playerSideMap);
  });
});

http.listen(3000, () => {
  console.log("server started");
});

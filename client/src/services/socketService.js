import io from "socket.io-client";
let socket;

const onConnect = (cb) => {
  socket.on("connect", cb);
};

export default {
  getSocket: () => {
    if (!socket) {
      socket = io("http://localhost:3000", { transports: ["websocket"] });
    }
    return socket;
  },
  onConnect,
};

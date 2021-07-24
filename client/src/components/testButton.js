import $ from "jquery";

export default class TestButton {
  constructor(socket) {
    this.socket = socket;

    this._setListeners();
  }

  _setListeners() {
    $("#start-btn").on("click", () => {
      console.log("button click");
      this.socket.emit("room", "test");
      $("#game-canvas").show();
    });

    this.socket.on("roomJoined", (message) => console.log(message));
  }
}

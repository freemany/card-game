import Phaser from "phaser";
import Game from "./scenes/game";
import $ from "jquery";

const config = {
  type: Phaser.AUTO,
  parent: "game-canvas",
  width: 800,
  height: 600,
  scene: [Game],
};

const game = new Phaser.Game(config);

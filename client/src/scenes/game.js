import Phaser from "phaser";
import { dealText } from "../constants/colors";
import cardsService from "../services/cardsService";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  preload() {
    this.load.image("cardFront", "src/assets/cards/card_front.png");
    cardsService.loadCards(this, "cardFront");
  }

  create() {
    this.dealText = this.add
      .text(75, 350, ["DEAL CARDS"])
      .setFontSize(18)
      .setColor(dealText.default)
      .setInteractive();
    this.dealText.on("pointerdown", () => {
      cardsService.dealCards();
    });
    this.dealText.on("pointerover", () => {
      this.dealText.setColor(dealText.pointerover);
    });
    this.dealText.on("pointerout", () => {
      this.dealText.setColor(dealText.default);
    });

    this.reviewText = this.add
      .text(75, 300, ["REVIEW CARDS"])
      .setFontSize(18)
      .setColor(dealText.default)
      .setInteractive();
    this.reviewText.on("pointerdown", () => {
      cardsService.flipCards();
    });
    this.reviewText.on("pointerover", () => {
      this.reviewText.setColor(dealText.pointerover);
    });
    this.reviewText.on("pointerout", () => {
      this.reviewText.setColor(dealText.default);
    });

    this.input.on("drag", (pointer, item, dragX, dragY) => {
      item.x = dragX;
      item.y = dragY;
    });
  }
}

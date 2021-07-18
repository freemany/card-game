import Phaser from "phaser";
import { dealText } from "../constants/colors";
import cardsService from "../services/cardsService";
import Zone from "../services/zone";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  preload() {
    this.load.image("cardFront", "src/assets/cards/card_front.png");
    cardsService.loadCards(this, "cardFront");
  }

  create() {
    this.zone = new Zone(this);
    this.dropZone = this.zone.renderDropZone();
    this.outline = this.zone.renderOutline(this.dropZone);

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
      // cardsService.flipCards();
      const card = this.dropZone.data.values.card;
      cardsService.flipCard(this.dropZone.data.values.card);
    });
    this.reviewText.on("pointerover", () => {
      this.reviewText.setColor(dealText.pointerover);
    });
    this.reviewText.on("pointerout", () => {
      this.reviewText.setColor(dealText.default);
    });

    this.input.on("drag", (pointer, item, dragX, dragY) => {
      if (this.dropZone.data.values.card) {
        return;
      }
      item.x = dragX;
      item.y = dragY;
    });
    this.input.on("dragstart", (pointer, gameObject) => {
      if (this.dropZone.data.values.card) {
        return;
      }
      gameObject.setTint(0xff69b4);
      this.children.bringToTop(gameObject);
    });
    this.input.on("dragend", (pointer, gameObject, dropped) => {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      dropZone.data.values.card = cardsService.getCards()[gameObject.index];
    });
  }
}

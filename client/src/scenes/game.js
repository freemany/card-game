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

  _createDropZoneA() {
    this.zoneA = new Zone(this, [400, 275, 200, 250]);
    this.dropZoneA = this.zoneA.renderDropZone();
    this.outlineA = this.zoneA.renderOutline(this.dropZoneA);
  }
  _createDropZoneB() {
    this.zoneB = new Zone(this, [650, 275, 200, 250]);
    this.dropZoneB = this.zoneB.renderDropZone();
    this.outlineB = this.zoneB.renderOutline(this.dropZoneB);
  }

  _addNextButton() {
    this.nextButton = this.add
      .text(75, 250, ["NEXT ROUND"])
      .setFontSize(18)
      .setColor(dealText.default)
      .setInteractive();
    this.nextButton.on("pointerdown", () => {
      const cardA = this.dropZoneA.data.values.card;
      const cardB = this.dropZoneB.data.values.card;
      cardA.destroy();
      cardB.destroy();
      this.dropZoneA.data.values.card = null;
      this.dropZoneB.data.values.card = null;
    });
    this.nextButton.on("pointerover", () => {
      this.nextButton.setColor(dealText.pointerover);
    });
    this.nextButton.on("pointerout", () => {
      this.nextButton.setColor(dealText.default);
    });
  }

  create() {
    this._addNextButton();
    this._createDropZoneA();
    this._createDropZoneB();

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

    this.battleButton = this.add
      .text(75, 300, ["BATTLE"])
      .setFontSize(18)
      .setColor(dealText.default)
      .setInteractive();
    this.battleButton.on("pointerdown", () => {
      // cardsService.flipCards();
      const cardA = this.dropZoneA.data.values.card;
      const cardB = this.dropZoneB.data.values.card;
      console.log(cardA, cardB);
      cardsService.flipCard(cardA);
      cardsService.flipCard(cardB);

      console.log(cardsService.battle(cardA, cardB));
    });
    this.battleButton.on("pointerover", () => {
      this.battleButton.setColor(dealText.pointerover);
    });
    this.battleButton.on("pointerout", () => {
      this.battleButton.setColor(dealText.default);
    });

    this.input.on("drag", (pointer, item, dragX, dragY) => {
      if (this.dropZoneA.data.values.card && this.dropZoneB.data.values.card) {
        return;
      }
      item.x = dragX;
      item.y = dragY;
    });
    this.input.on("dragstart", (pointer, gameObject) => {
      if (this.dropZoneA.data.values.card && this.dropZoneB.data.values.card) {
        return;
      }
      gameObject.setTint(0xff69b4);
      // this.children.bringToTop(gameObject);
    });
    this.input.on("dragend", (pointer, gameObject, dropped) => {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      if (dropZone.data.values.card) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        return;
      }
      dropZone.data.values.card = cardsService.getCards()[gameObject.index];
    });
  }
}

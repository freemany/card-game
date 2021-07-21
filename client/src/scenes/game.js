import Phaser from "phaser";
// import io from "socket.io-client";
import { dealText } from "../constants/colors";
import cardsService from "../services/cardsService";
import Zone from "../services/zone";
import socketService from "./../services/socketService";
import TestButton from "../components/testButton";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
    this.start = false;
    this.dealReady = true;
    this.battleReady = false;
    this.clearReady = false;
    this.scores = { playA: 0, playB: 0 };
    this.side = "B";
    this.setup = {
      A: {
        A: {
          label: [100, 450],
          score: [350, 450],
          dropZone: [400, 275, 200, 250],
        },
        B: {
          label: [100, 50],
          score: [350, 50],
          dropZone: [650, 275, 200, 250],
        },
      },
      B: {
        B: {
          label: [100, 450],
          score: [350, 450],
          dropZone: [400, 275, 200, 250],
        },
        A: {
          label: [100, 50],
          score: [350, 50],
          dropZone: [650, 275, 200, 250],
        },
      },
    };
  }

  preload() {
    this.load.image("cardFront", "src/assets/cards/card_front.png");
    cardsService.loadCards(this, "cardFront");
  }

  _createDropZoneA() {
    this.zoneA = new Zone(this, this.setup[this.side].A.dropZone);
    this.dropZoneA = this.zoneA.renderDropZone();
    this.outlineA = this.zoneA.renderOutline(this.dropZoneA);
  }
  _createDropZoneB() {
    this.zoneB = new Zone(this, this.setup[this.side].B.dropZone);
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
      if (!this.clearReady) return;
      const cardA = this.dropZoneA.data.values.card;
      const cardB = this.dropZoneB.data.values.card;
      cardA.destroy();
      cardB.destroy();
      this.dropZoneA.data.values.card = null;
      this.dropZoneB.data.values.card = null;
      this.battleReady = false;
      this.clearReady = false;
    });
    this.nextButton.on("pointerover", () => {
      this.nextButton.setColor(dealText.pointerover);
    });
    this.nextButton.on("pointerout", () => {
      this.nextButton.setColor(dealText.default);
    });
  }

  _connectSocket() {
    this.socket = socketService.getSocket();
    socketService.onConnect(() => {
      console.log("connected");
    });

    new TestButton(this.socket);
  }

  _addPlayersText() {
    this.playALabel = this.add
      .text(
        this.setup[this.side].A.label[0],
        this.setup[this.side].A.label[1],
        ["PLAYER A"]
      )
      .setFontSize(38)
      .setColor(dealText.default);
    this.playAScore = this.add
      .text(
        this.setup[this.side].A.score[0],
        this.setup[this.side].A.score[1],
        [this.scores.playA]
      )
      .setFontSize(38)
      .setColor(dealText.default);
    this.playBLabel = this.add
      .text(
        this.setup[this.side].B.label[0],
        this.setup[this.side].B.label[1],
        ["PLAYER B"]
      )
      .setFontSize(38)
      .setColor(dealText.pointerover);
    this.playBScore = this.add
      .text(
        this.setup[this.side].B.score[0],
        this.setup[this.side].B.score[1],
        [this.scores.playB]
      )
      .setFontSize(38)
      .setColor(dealText.pointerover);
  }

  create() {
    this._connectSocket();
    this._addNextButton();
    this._addPlayersText();
    this._createDropZoneA();
    this._createDropZoneB();

    this.dealText = this.add
      .text(75, 350, ["DEAL CARDS"])
      .setFontSize(18)
      .setColor(dealText.default)
      .setInteractive();
    this.dealText.on("pointerdown", () => {
      cardsService.dealCards();
      this.dealReady = false;
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
      if (!this.battleReady) return;
      this.clearReady = true;

      const cardA = this.dropZoneA.data.values.card;
      const cardB = this.dropZoneB.data.values.card;

      cardsService.flipCard(cardA);
      cardsService.flipCard(cardB);
      this.battleReady = false;

      const result = cardsService.battle(cardA, cardB);

      if (result === "A") {
        this.playAScore.text = Number(this.playAScore.text) + 1;
      } else {
        this.playBScore.text = Number(this.playBScore.text) + 1;
      }
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
      gameObject.x = dropZone.x;
      gameObject.y = dropZone.y;
      gameObject.disableInteractive();
      if (this.dropZoneA.data.values.card && this.dropZoneB.data.values.card) {
        this.battleReady = true;
      }
    });
  }

  update() {
    if (this.battleReady) {
      this.battleButton.setColor(dealText.default);
    } else {
      this.battleButton.setColor(dealText.pointerover);
    }
    if (this.clearReady) {
      this.nextButton.setColor(dealText.default);
    } else {
      this.nextButton.setColor(dealText.pointerover);
    }
    if (this.dealReady) {
      this.dealText.setColor(dealText.default);
    } else {
      this.dealText.setColor(dealText.pointerover);
    }
  }
}

export default class Card {
  constructor(scene, value, index, frontCardSprite) {
    this.scene = scene;
    this.value = value;
    this.index = index;
    this.frontCard = frontCardSprite;
  }

  load() {
    this.sprite = `card_${this.value}`;
    this.scene.load.image(this.sprite, `src/assets/cards/${this.value}.png`);
    this.side = this.frontCard;
    return this;
  }

  add() {
    this.gameObject = this.scene.add
      .sprite(250, 200 + this.index * 20, this.frontCard)
      .setScale(0.5, 0.5)
      .setInteractive();

    this.scene.input.setDraggable(this.gameObject);

    return this;
  }

  flip() {
    if (this.side === this.frontCard) {
      this.gameObject.setTexture(this.sprite);

      this.side = this.sprite;
      return;
    }

    this.gameObject.setTexture(this.frontCard);
  }
}

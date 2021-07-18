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
  // @TODO should call it render instead
  add() {
    this.gameObject = this.scene.add
      .sprite(250, 200 + this.index * 20, this.frontCard)
      .setScale(0.5, 0.5)
      .setInteractive();
    this.gameObject.index = this.index;
    this.gameObject.depth = this.index;

    this.scene.input.setDraggable(this.gameObject);

    return this;
  }

  flip() {
    const timeline = this.scene.tweens.timeline({
      onComplete: () => {
        timeline.destroy();
      },
    });

    timeline.add({ targets: this.gameObject, scale: 0.55, duration: 300 });
    timeline.add({
      targets: this.gameObject,
      scaleX: 0,
      duration: 300,
      delay: 200,
      onComlete: () => {
        if (this.side === this.frontCard) {
          this.gameObject.setTexture(this.sprite);
          this.side = this.sprite;

          return;
        }

        this.gameObject.setTexture(this.frontCard);
        this.side = this.frontCard;
      },
    });

    timeline.add({
      targets: this.gameObject,
      scaleX: 0.55,
      duration: 300,
    });

    timeline.add({
      targets: this.gameObject,
      scaleX: 0.5,
      duration: 300,
    });

    timeline.play();
  }

  destroy() {
    this.gameObject.destroy();
  }
}

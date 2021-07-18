export default class DropZone {
  constructor(scene) {
    this.scene = scene;
  }

  render() {
    const zone = this.scene.add
      .zone(700, 375, 200, 250)
      .setRectangleDropZone(200, 250);
    zone.setData({ card: null });

    return zone;
  }

  renderOutline(dropZone) {
    const zoneOutline = this.scene.add.graphics();
    zoneOutline.lineStyle(4, 0xff69b4);
    zoneOutline.strokeRect(
      dropZone.x - dropZone.input.hitArea.width / 2,
      dropZone.y - dropZone.input.hitArea.height / 2,
      dropZone.input.hitArea.width,
      dropZone.input.hitArea
    );
  }
}

export default class Zone {
  constructor(scene, position) {
    this.scene = scene;
    this.position = position;
  }

  renderDropZone() {
    const zone = this.scene.add
      .zone(
        this.position[0],
        this.position[1],
        this.position[2],
        this.position[3]
      ) //500, 275, 200, 250
      .setRectangleDropZone(this.position[2], this.position[3]);
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
      dropZone.input.hitArea.height
    );
  }
}

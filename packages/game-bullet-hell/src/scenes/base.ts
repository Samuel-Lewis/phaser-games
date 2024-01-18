import Phaser from 'phaser';

import { RenderLayer } from '../keys';

export class BaseScene extends Phaser.Scene {
  private imageBackground!: Phaser.GameObjects.TileSprite;
  private labelFps!: Phaser.GameObjects.Text;

  constructor(sceneKey: string) {
    super(sceneKey);
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    this.imageBackground = this.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setDepth(RenderLayer.Background);

    // FPS label
    this.labelFps = this.add.text(10, 10, '').setDepth(RenderLayer.UI);
  }

  update(time: number, delta: number) {
    this.imageBackground.tilePositionY -= 1;

    // FPS counter
    const fps = Math.floor(1000 / delta);
    this.labelFps.setText(`FPS: ${fps}`);
  }
}

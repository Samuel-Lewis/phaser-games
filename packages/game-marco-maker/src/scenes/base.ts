import Phaser from 'phaser';

import { RenderLayer } from '../keys';

export class BaseScene extends Phaser.Scene {
  private labelFps!: Phaser.GameObjects.Text;

  constructor(sceneKey: string) {
    super(sceneKey);
  }

  preload() {}

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    // FPS label
    this.labelFps = this.add.text(10, 10, '').setDepth(RenderLayer.UI);
  }

  update(time: number, delta: number) {
    // FPS counter
    const fps = Math.floor(1000 / delta);
    this.labelFps.setText(`FPS: ${fps}`);
  }
}

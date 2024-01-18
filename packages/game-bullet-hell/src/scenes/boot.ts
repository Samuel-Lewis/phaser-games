import Phaser from 'phaser';

import { SceneKeys } from '../keys';

export class BootScene extends Phaser.Scene {
  private loadProgress = 0;

  private labelLoad?: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.Boot);
  }

  preload() {
    const origin = window.location.origin;
    this.load.setBaseURL(origin);

    this.load.on('progress', (progress: number) => {
      this.loadProgress = progress;
    });

    this.load.atlas(
      'sprites',
      'bullet-hell/graphics/sprites.png',
      'bullet-hell/graphics/sprites.json'
    );

    this.load.image('background', 'bullet-hell/graphics/bg_darkPurple.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.labelLoad = this.add.text(centerX, centerY, '');
  }

  update() {
    if (this.loadProgress === 1) {
      this.scene.start(SceneKeys.StartScreen);
    }

    const loadPercent = Math.round(this.loadProgress * 100);
    this.labelLoad?.setText(`Loading ${loadPercent}%`);
  }
}

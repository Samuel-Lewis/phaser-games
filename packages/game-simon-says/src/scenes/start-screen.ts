import Phaser from 'phaser';

import { SceneKeys } from '../keys';

export class StartScreenScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.StartScreen);
  }

  preload() {
    const origin = window.location.origin;
    this.load.setBaseURL(origin);
    this.load.audio('game-over', 'simon-says/sound/game-over.mp3');
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.add
      .text(centerX, centerY - 200, `Simon Says`, {
        fontSize: '96px',
        fontFamily: 'pixel',
      })
      .setOrigin(0.5)
      .setAlign('center');

    this.add
      .text(centerX, centerY, `Click to Start`, {
        fontSize: '32px',
        fontFamily: 'pixel',
      })
      .setOrigin(0.5)
      .setAlign('center');

    this.input.on('pointerdown', () => this.scene.start(SceneKeys.Game));
  }
}

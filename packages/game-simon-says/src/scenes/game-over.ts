import Phaser from 'phaser';

import { SceneKeys } from '../keys';

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;

  constructor() {
    super(SceneKeys.GameOver);
  }

  init(data: { score: number }) {
    this.score = data.score;
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
      .text(centerX, centerY, `GAME OVER\nScore: ${this.score}`, {
        fontSize: '48px',
        fontFamily: 'pixel',
      })
      .setOrigin(0.5)
      .setAlign('center');

    this.add
      .text(centerX, centerY + 128, `Click to Start`, {
        fontSize: '32px',
        fontFamily: 'pixel',
      })
      .setOrigin(0.5)
      .setAlign('center');

    this.sound.play('game-over');

    this.input.on('pointerdown', () => this.scene.start(SceneKeys.Game));
  }
}

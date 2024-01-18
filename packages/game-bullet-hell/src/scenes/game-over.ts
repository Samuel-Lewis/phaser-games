import Phaser from 'phaser';

import { SceneKeys } from '../keys';

import { BaseScene } from './base';

export class GameOverScene extends BaseScene {
  private labelTitle!: Phaser.GameObjects.Text;
  private labelScore!: Phaser.GameObjects.Text;
  private labelStartAgain!: Phaser.GameObjects.Text;
  private score = 0;

  constructor() {
    super(SceneKeys.GameOver);
  }

  init(data: { score: number }) {
    this.score = data.score;
  }

  create() {
    super.create();
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.labelTitle = this.add
      .text(centerX, centerY, 'Game Over', {
        fontSize: '96px',
        color: '#ffffff',
        fontFamily: 'future, Verdana, sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setAlign('center');

    this.labelScore = this.add
      .text(centerX, centerY + 256, `Score: ${this.score}`, {
        fontSize: '48px',
        color: '#ffffff',
        fontFamily: 'future, Verdana, sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setAlign('center');

    this.labelStartAgain = this.add
      .text(centerX, height - 100, 'Click to Play Again', {
        fontSize: '48px',
        color: '#ffffff',
        fontFamily: 'future, Verdana, sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setAlign('center');

    this.input.on('pointerdown', () => {
      this.scene.start(SceneKeys.Game);
    });
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.labelScore.setText(`Score: ${this.score}`);
  }
}

import Phaser from 'phaser';

import { SceneKeys } from '../keys';

export class GameOverScene extends Phaser.Scene {
  private labelTitle!: Phaser.GameObjects.Text;
  private labelScore!: Phaser.GameObjects.Text;
  private labelStartAgain!: Phaser.GameObjects.Text;
  private imageBackground!: Phaser.GameObjects.TileSprite;
  private score = 0;

  constructor() {
    super(SceneKeys.GameOver);
  }

  init(data: { score: number }) {
    this.score = data.score;
  }

  preload() {
    const origin = window.location.origin;
    this.load.setBaseURL(origin);

    this.load.image('background', 'bullet-hell/graphics/bg_darkPurple.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.imageBackground = this.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0);

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

  update() {
    this.imageBackground.tilePositionY -= 1;
    this.labelScore.setText(`Score: ${this.score}`);
  }
}

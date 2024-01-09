import { SceneKeys } from '../keys';

export class GameOverScene extends Phaser.Scene {
  private labelFps!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.GameOver);
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // FPS label
    this.labelFps = this.add.text(10, 10, '');

    this.add
      .text(width / 2, height / 2, 'GAME OVER', {
        fontSize: '48px',
        fontFamily: 'pixel',
      })
      .setOrigin(0.5);
  }

  update(time: number, delta: number) {
    this.labelFps.setText(`FPS: ${Math.round(1000 / delta)}`);
  }
}

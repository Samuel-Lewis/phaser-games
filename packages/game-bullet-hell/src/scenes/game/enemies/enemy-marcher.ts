import { GameScene } from '..';

import { EnemyObject } from './enemy';

export class EnemyMarcherObject extends EnemyObject {
  constructor(
    scene: GameScene,
    x = 0,
    y = -100,
    texture = 'sprites',
    frame = 'enemyRed2',
    options: { score: number; duration: number } = {
      score: 100,
      duration: 5000,
    }
  ) {
    super(scene, x, y, texture, frame, options);
  }

  create() {
    super.create();

    const { width, height } = this.scene.sys.game.canvas;
    if (this.x === 0) {
      this.x = Phaser.Math.Between(0, width);
    }
    this.y = -100;

    this.scene.tweens.add({
      targets: this,
      y: height + 100,
      duration: this.duration,
      ease: 'Linear',
      onComplete: () => {
        this.destroy();
      },
    });

    return this;
  }
}

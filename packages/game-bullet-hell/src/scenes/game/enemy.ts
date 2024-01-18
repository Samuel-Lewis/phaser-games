import Phaser from 'phaser';

import { GameScene } from './index';

export class EnemyObject extends Phaser.Physics.Arcade.Sprite {
  scene: GameScene;
  private score;
  private duration = 5000;

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
    super(scene, x, y, texture, frame);
    this.scene = scene;

    const { score, duration } = options;
    this.score = score;
    this.duration = duration;

    return this;
  }

  create() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.groupEnemies.add(this);

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

  getScore() {
    return this.score;
  }

  getDuration() {
    return this.duration;
  }
}

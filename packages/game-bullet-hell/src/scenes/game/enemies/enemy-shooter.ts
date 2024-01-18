import Phaser from 'phaser';

import { GameScene } from '..';

import { EnemyObject } from './enemy';

const Y_STOP = 400;
const X_STRAFE_DURATION = 3000;

export class EnemyShooterObject extends EnemyObject {
  constructor(
    scene: GameScene,
    x = 0,
    y = -100,
    texture = 'sprites',
    frame = 'enemyRed4',
    options: { score: number; duration: number } = {
      score: 200,
      duration: 5000,
    }
  ) {
    super(scene, x, y, texture, frame, options);
  }

  create() {
    super.create();

    const { width, height } = this.scene.sys.game.canvas;

    if (this.x !== 0) {
      this.x = Phaser.Math.Between(0, width);
    }

    const targetStrafeX = Phaser.Math.Between(0, width);

    const xDelta = targetStrafeX - this.x;
    const randomXBreak = Phaser.Math.FloatBetween(0.2, 0.8);
    const xShootPosition = this.x + randomXBreak * xDelta;

    this.scene.tweens.chain({
      targets: this,
      tweens: [
        {
          y: Y_STOP,
          duration: (Y_STOP / height) * this.duration,
        },
        {
          x: xShootPosition,
          duration: X_STRAFE_DURATION * randomXBreak,
          onComplete: () => {
            if (this.active) {
              this.shoot();
            }
          },
        },
        {
          x: targetStrafeX,
          duration: X_STRAFE_DURATION * (1 - randomXBreak),
        },
        {
          y: height + 100,
          duration: ((height - Y_STOP) / height) * this.duration,
          onComplete: () => {
            this.destroy();
          },
        },
      ],
    });

    return this;
  }

  shoot() {
    const { height } = this.scene.sys.game.canvas;

    const laser = this.scene.physics.add
      .image(this.x, this.y, 'sprites', 'laserRed08')
      .setOrigin(0.5, 0.5)
      .setScale(1.5);

    this.scene.tweens.add({
      targets: laser,
      y: height + 10,
      duration: 3000,
      ease: 'Linear',
      onComplete: () => {
        if (laser.active) {
          laser.destroy();
        }
      },
    });

    this.scene.tweens.add({
      targets: laser,
      angle: 360,
      duration: 1000,
      repeat: -1,
    });

    this.scene.groupEnemyProjectiles.add(laser);
  }
}

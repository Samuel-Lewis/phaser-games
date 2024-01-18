import Phaser from 'phaser';

import { RenderLayer } from '../../keys';

import { PlayerObject } from './player';

import { GameScene } from './index';

export class PowerObject extends Phaser.Physics.Arcade.Sprite {
  scene: GameScene;

  constructor(
    scene: GameScene,
    x = 0,
    y = 0,
    texture = 'sprites',
    frame = 'powerupBlue_shield'
  ) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    return this;
  }

  create() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.groupPowerUps.add(this);
    this.setDepth(RenderLayer.Game);

    const { width, height } = this.scene.sys.game.canvas;
    if (this.x === 0) {
      this.x = Phaser.Math.Between(0, width);
    }
    this.y = -100;

    this.scale = 1.5;

    this.scene.tweens.add({
      targets: this,
      y: height + 100,
      duration: 6000,
      ease: 'Linear',
      onComplete: () => {
        this.destroy();
      },
    });

    return this;
  }

  applyEffect(player: PlayerObject) {
    player.increaseShield();
  }
}

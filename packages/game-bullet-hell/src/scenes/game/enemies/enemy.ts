import Phaser from 'phaser';

import { RenderLayer } from '../../../keys';
import { GameScene } from '../index';

export class EnemyObject extends Phaser.Physics.Arcade.Sprite {
  scene: GameScene;
  protected score;
  protected duration = 5000;

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
    this.setDepth(RenderLayer.Game);

    return this;
  }

  create() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.groupEnemies.add(this);

    return this;
  }

  getScore() {
    return this.score;
  }

  getDuration() {
    return this.duration;
  }
}

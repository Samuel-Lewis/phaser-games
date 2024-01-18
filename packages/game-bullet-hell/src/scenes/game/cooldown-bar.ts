import Phaser from 'phaser';

import { RenderLayer } from '../../keys';

import { GameScene } from './index';

const BAR_HEIGHT = 5;
const BAR_COLOUR = 0xffffff;
const GROW_SPEED = 25;

export class CooldownBar extends Phaser.GameObjects.Graphics {
  scene: GameScene;

  constructor(scene: GameScene) {
    super(scene);
    this.scene = scene;
    return this;
  }

  create() {
    const { width, height } = this.scene.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.clear();
    this.fillStyle(BAR_COLOUR);
    this.fillRect(-centerX, 0, width, BAR_HEIGHT);

    this.y = height - BAR_HEIGHT;
    this.x = centerX;

    this.scaleX = 0;
    this.setDepth(RenderLayer.UI);

    this.scene.add.existing(this);
    return this;
  }

  fire(duration: number) {
    this.scene.tweens.chain({
      targets: this,
      tweens: [
        {
          scaleX: 1,
          duration: GROW_SPEED,
        },
        {
          scaleX: 0,
          duration: duration - GROW_SPEED,
        },
      ],
    });
  }
}

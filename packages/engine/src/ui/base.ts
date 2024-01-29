import Phaser from 'phaser';

export interface BaseConfig {
  width?: number;
  height?: number;
}

export class BaseElement
  extends Phaser.GameObjects.Container
  implements BaseConfig
{
  width: number = 160;
  height: number = 40;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: Partial<BaseConfig> = {}
  ) {
    super(scene, x, y);
    Object.assign(this, { ...this, ...config });
  }

  create() {
    return this;
  }
}

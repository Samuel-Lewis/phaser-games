import Phaser from 'phaser';

export type BaseConfig = {
  width?: number;
  height?: number;
};

const defaultConfig: Required<BaseConfig> = {
  width: 160,
  height: 40,
};

export class BaseElement extends Phaser.GameObjects.Container {
  width: number;
  height: number;

  config: Required<BaseConfig> = defaultConfig;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: BaseConfig = defaultConfig
  ) {
    const combinedConfig = { ...defaultConfig, ...config };

    super(scene, x, y);

    this.config = combinedConfig;
    this.width = combinedConfig.width;
    this.height = combinedConfig.height;
  }

  create() {
    return this;
  }
}

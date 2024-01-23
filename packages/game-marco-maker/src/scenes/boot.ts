import Phaser from 'phaser';

import { BootScene } from '@samuel-lewis/engine';

import { SceneKeys } from '../keys';

export class MarcoBootScene extends BootScene {
  constructor() {
    super(SceneKeys.Boot, SceneKeys.StartScreen);
  }

  preload() {
    super.preload();

    this.load.image('tiles', 'marco-maker/graphics/tiles.png');
    this.load.atlas(
      'sprites',
      'marco-maker/graphics/sprites.png',
      'marco-maker/graphics/sprites.json'
    );
  }

  update() {
    super.update();
  }

  create() {
    super.create();
  }
}

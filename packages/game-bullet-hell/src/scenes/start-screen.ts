import Phaser from 'phaser';

import { SceneKeys } from '../keys';

export class StartScreenScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.StartScreen);
  }

  preload() {
    const origin = window.location.origin;
    this.load.setBaseURL(origin);
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
  }
}

import { SceneKeys } from '../keys';

import { BaseScene } from './base';

export class StartScreenScene extends BaseScene {
  constructor() {
    super(SceneKeys.StartScreen);
  }

  create() {
    super.create();
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.add
      .text(centerX, centerY, 'Click to Start', {
        fontSize: '96px',
        color: '#ffffff',
        fontFamily: 'future, Verdana, sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setAlign('center');

    this.input.on('pointerdown', () => {
      this.scene.start(SceneKeys.Editor);
    });
  }
}

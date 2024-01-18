import Phaser from 'phaser';

import { SceneKeys } from '../keys';

export class BootScene extends Phaser.Scene {
  private loadProgress = 0;

  private labelLoad?: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.Boot);
  }

  preload() {
    const origin = window.location.origin;
    this.load.setBaseURL(origin);

    this.load.atlas(
      'sprites',
      'bullet-hell/graphics/sprites.png',
      'bullet-hell/graphics/sprites.json'
    );

    this.load.image('background', 'bullet-hell/graphics/bg_darkPurple.png');

    const sounds = [
      'laser1',
      'laser2',
      'lose',
      'shieldDown',
      'shieldUp',
      'twoTone',
      'zap',
    ];

    for (let i = 0; i < sounds.length; i++) {
      const fileName = sounds[i] ?? 'laser1';
      this.load.audio(fileName, [
        `bullet-hell/sound/${fileName}.ogg`,
        `bullet-hell/sound/${fileName}.mp3`,
      ]);
    }

    this.load.on('progress', (progress: number) => {
      this.loadProgress = progress;
    });

    this.load.on('complete', () => {
      this.scene.start(SceneKeys.StartScreen);
    });
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.labelLoad = this.add.text(centerX, centerY, '', {
      color: '#ffffff',
      fontFamily: 'future, Verdana, sans-serif',
    });
  }

  update() {
    const loadPercent = Math.round(this.loadProgress * 100);
    this.labelLoad?.setText(`Loading ${loadPercent}%`);
  }
}

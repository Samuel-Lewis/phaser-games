import Phaser from 'phaser';

import { Game, defaultConfig } from '@samuel-lewis/engine';

import { MarcoBootScene } from './scenes/boot';
import { ChamberScene } from './scenes/chamber';
import { ChamberUIScene } from './scenes/chamber/ui';
import { EditorScene } from './scenes/editor';
import { StartScreenScene } from './scenes/start-screen';

const config: Phaser.Types.Core.GameConfig = {
  ...defaultConfig,
  scene: [
    MarcoBootScene,
    StartScreenScene,
    EditorScene,
    ChamberScene,
    ChamberUIScene,
  ],
  pixelArt: false,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 1000 },
    },
  },
};

export const MarcoMakerGame = new Game('marco-maker', 'Marco Maker', config);

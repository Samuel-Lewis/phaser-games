import Phaser from 'phaser';

import { Game, defaultConfig } from '@samuel-lewis/engine';

import { MarcoBootScene } from './scenes/boot';
import { EditorScene } from './scenes/editor';
import { PlayerScene } from './scenes/player';
import { StartScreenScene } from './scenes/start-screen';

const config: Phaser.Types.Core.GameConfig = {
  ...defaultConfig,
  scene: [MarcoBootScene, StartScreenScene, EditorScene, PlayerScene],
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
      debug: false,
    },
  },
};

export const MarcoMakerGame = new Game('marco-maker', 'Marco Maker', config);

import Phaser from 'phaser';

import { Game, defaultConfig } from '@samuel-lewis/engine';

import { Network } from './scenes/network';
import { Waves } from './scenes/waves';

const config: Phaser.Types.Core.GameConfig = {
  ...defaultConfig,
  pixelArt: false,
  scene: [],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: undefined,
};

export const NetworkGame = new Game('network', 'Network', {
  ...config,
  scene: [Network],
});

export const WavesGame = new Game('waves', 'Waves', {
  ...config,
  scene: [Waves],
});

import Phaser from 'phaser';

import { Game, defaultConfig } from '@samuel-lewis/engine';

import { BootScene } from './scenes/boot';
import { GameScene } from './scenes/game';
import { GameOverScene } from './scenes/game-over';
import { StartScreenScene } from './scenes/start-screen';

const config: Phaser.Types.Core.GameConfig = {
  ...defaultConfig,
  scene: [BootScene, StartScreenScene, GameScene, GameOverScene],
  pixelArt: false,
  width: 1080,
  height: 1920,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

export const BulletHellGame = new Game('bullet-hell', 'Bullet Hell', config);

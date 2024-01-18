import Phaser from 'phaser';

import { Game, defaultConfig } from '@samuel-lewis/engine';

import { GameScene } from './scenes/game';
import { GameOverScene } from './scenes/game-over';
import { StartScreenScene } from './scenes/start-screen';

const config: Phaser.Types.Core.GameConfig = {
  ...defaultConfig,
  scene: [GameScene, GameOverScene, StartScreenScene],
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

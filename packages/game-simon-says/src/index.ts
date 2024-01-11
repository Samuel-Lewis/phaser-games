import Phaser from 'phaser';

import { Game, defaultConfig } from '@samuel-lewis/engine';

import { GameScene } from './scenes/game';
import { GameOverScene } from './scenes/game-over';
import { StartScreenScene } from './scenes/start-screen';

const config: Phaser.Types.Core.GameConfig = {
  ...defaultConfig,
  scene: [StartScreenScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: undefined,
};

export const SimonSaysGame = new Game('simon-says', 'Simon Says', config);

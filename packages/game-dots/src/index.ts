import Phaser from "phaser";

import { Game, defaultConfig } from "@samuel-lewis/engine";

import { Network } from "./scenes/network";

const config: Phaser.Types.Core.GameConfig = {
  ...defaultConfig,
  pixelArt: false,
  scene: [Network],
};

export const DotsGame = new Game("dots", "Dots", config);

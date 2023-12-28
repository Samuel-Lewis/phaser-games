import Phaser from "phaser";

import { Game, defaultConfig } from "@samuel-lewis/engine";

import { Example } from "./scenes/hello-world";

const config: Phaser.Types.Core.GameConfig = {
  ...defaultConfig,
  scene: Example,
};

export const ExampleGame = new Game("example", "Example Template", config);

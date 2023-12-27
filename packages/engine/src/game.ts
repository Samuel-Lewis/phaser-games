import Phaser from "phaser";

export class Game {
  constructor(
    public name: string,
    public config: Phaser.Types.Core.GameConfig
  ) {}

  instance = (elementId: string) => {
    return new Phaser.Game({ ...this.config, parent: elementId });
  };
}

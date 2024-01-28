import { SceneKeys } from '../../keys';
import { Level } from '../../lib/level';
import { BaseScene } from '../base';

export class PlayerScene extends BaseScene {
  private level!: Level;

  constructor() {
    super(SceneKeys.Player);
  }

  init({ serialisedLevel }: { serialisedLevel?: string }) {
    if (serialisedLevel) {
      this.level = Level.fromSerialised(serialisedLevel);
    } else {
      this.level = new Level();
    }
  }

  create() {
    super.create();
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.add
      .text(centerX, centerY, 'Pllaayyyerrr', {
        fontSize: '96px',
        color: '#ffffff',
        fontFamily: 'future, Verdana, sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setAlign('center');

    // this.input.on('pointerdown', () => {
    //   this.scene.start(SceneKeys.Game);
    // });
  }
}

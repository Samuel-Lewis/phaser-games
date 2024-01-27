import Phaser from 'phaser';

import { SceneKeys } from '../../keys';
import { Level } from '../../lib/level';
import { BaseScene } from '../base';

import { EditingArea } from './editing';

export class EditorScene extends BaseScene {
  private level!: Level;

  constructor() {
    super(SceneKeys.Editor);
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

    this.scene.add(SceneKeys.EditorArea, EditingArea, true, {
      level: this.level,
    });
  }

  update(time: number, deltaTime: number) {
    super.update(time, deltaTime);
  }
}

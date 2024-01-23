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

    const COLOR_DARK = 0x260e04;
    const COLOR_LIGHT = 0x693e1a;
    const COLOR_PRIMARY = 0x260e04;

    const config = {
      // layoutMode: 0,
      // leftSide,
      header: this.add.rectangle(0, 0, 10, 10, COLOR_PRIMARY), // Fixed height
      leftSide: this.add.rectangle(0, 0, 10, 10, COLOR_LIGHT), // Fixed width
      content: this.add.rectangle(0, 0, 30, 20, COLOR_DARK),
      rightSide: this.add.rectangle(0, 0, 50, 10, COLOR_LIGHT), // Fixed width
      footer: this.add.rectangle(0, 0, 10, 30, COLOR_PRIMARY), // Fixed height
      space: {
        header: 10,
        footer: 10,
        leftSide: 10,
        rightSide: 10,
      },
      expand: {
        header: true,
        footer: true,
        leftSide: true,
        rightSide: true,
        content: true,
      },
    };

    this.rexUI.add.holyGrail(config);
  }

  createBrushPallette() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    const left = this.add.rectangle(0, 0, 60, 10, 0x00ff00);

    return left;
  }

  update(time: number, deltaTime: number) {}
}

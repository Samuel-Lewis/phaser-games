import Phaser from 'phaser';

import { ButtonElement, RenderLayer } from '@samuel-lewis/engine';

import { EditorEvents, SceneKeys } from '../../keys';
import { BaseScene } from '../base';

enum EditingMode {
  Create,
  Tint,
  Erase,
}

export class EditorUIScene extends BaseScene {
  private editingMode: EditingMode = EditingMode.Create;

  constructor() {
    super(SceneKeys.EditorUI);
  }

  create() {
    super.create();
    this.createUI();

    return this;
  }

  createUI() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    const toolBrushWidth = 100;
    const toolBrushHeight = toolBrushWidth;
    const gridPadding = toolBrushWidth / 2;

    const buttonCreate = new ButtonElement(this, 0, 0, {
      label: '',
      width: toolBrushWidth,
      height: toolBrushHeight,
      hotkey: Phaser.Input.Keyboard.KeyCodes.ONE,
      icon: this.add.image(0, 0, 'icons', 'white/toolBrush'),
    })
      .onClick(() => {
        this.events.emit(EditorEvents.ToolDraw);
      })
      .create();
    const buttonPaint = new ButtonElement(this, 0, 0, {
      label: '',
      width: toolBrushWidth,
      height: toolBrushHeight,
      hotkey: Phaser.Input.Keyboard.KeyCodes.TWO,
      icon: this.add.image(0, 0, 'icons', 'white/toolFill'),
    })
      .onClick(() => {
        this.events.emit(EditorEvents.ToolPaint);
      })
      .create();
    const buttonErase = new ButtonElement(this, 0, 0, {
      label: '',
      width: toolBrushWidth,
      height: toolBrushHeight,
      hotkey: Phaser.Input.Keyboard.KeyCodes.THREE,
      icon: this.add.image(0, 0, 'icons', 'white/toolEraser'),
    })
      .onClick(() => {
        this.events.emit(EditorEvents.ToolErase);
      })
      .create();

    Phaser.Actions.GridAlign([buttonCreate, buttonPaint, buttonErase], {
      width: -1,
      height: 1,
      cellWidth: toolBrushWidth + gridPadding,
      cellHeight: toolBrushHeight,
      x: 20,
      y: 20,
    });

    this.updatePool.push(buttonCreate, buttonPaint, buttonErase);
  }
}

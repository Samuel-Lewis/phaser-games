import Phaser from 'phaser';

import { ButtonElement, ButtonMedium, ButtonTile } from '@samuel-lewis/engine';

import { EditorEvents, SceneKeys } from '../../keys';
import { BaseScene } from '../base';
import { GRID_PADDING, GRID_SIZE } from '@samuel-lewis/engine/src/ui/constants';

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
    this.createToolbar();
    this.createNavigation();

    return this;
  }

  createNavigation() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    const buttonNavPublish = new ButtonMedium(this, 0, 0, {
      label: 'Publish',
    })
      .onClick(() => {
        // this.events.emit(EditorEvents.NavigateTest);
      })
      .create();

    const buttonNavTest = new ButtonMedium(this, 0, 0, {
      label: 'Test',
    })
      .onClick(() => {
        this.events.emit(EditorEvents.NavigateTest);
      })
      .create();

    const elements = [buttonNavPublish, buttonNavTest];
    const totalWidth = elements.reduce((acc, el) => acc + el.width / 2, 0);
    const totalHeight = elements.reduce((acc, el) => acc + el.height, 0);

    Phaser.Actions.GridAlign([buttonNavPublish, buttonNavTest], {
      width: 1,
      height: -1,
      cellWidth: buttonNavPublish.width + GRID_PADDING,
      cellHeight: buttonNavPublish.height + GRID_PADDING,
      x: width - totalWidth - GRID_PADDING,
      y: height - totalHeight - GRID_PADDING * 2,
    });

    this.updatePool.push(buttonNavPublish, buttonNavTest);
  }

  createToolbar() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    const buttonCreate = new ButtonTile(this, 0, 0, {
      label: '',
      hotkey: Phaser.Input.Keyboard.KeyCodes.ONE,
      icon: this.add.image(0, 0, 'icons', 'white/toolBrush'),
    })
      .onClick(() => {
        this.events.emit(EditorEvents.ToolDraw);
      })
      .create();
    const buttonPaint = new ButtonTile(this, 0, 0, {
      label: '',
      hotkey: Phaser.Input.Keyboard.KeyCodes.TWO,
      icon: this.add.image(0, 0, 'icons', 'white/toolFill'),
    })
      .onClick(() => {
        this.events.emit(EditorEvents.ToolPaint);
      })
      .create();
    const buttonErase = new ButtonTile(this, 0, 0, {
      label: '',
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
      cellWidth: buttonCreate.width + GRID_PADDING,
      cellHeight: buttonCreate.height + GRID_PADDING,
      x: GRID_PADDING,
      y: GRID_PADDING,
    });

    this.updatePool.push(buttonCreate, buttonPaint, buttonErase);
  }
}

import Phaser from 'phaser';

import { RenderLayer } from '../../depth';
import { BaseConfig, BaseElement } from '../base';
import { keyToInputImage } from '../hotkey';
import { fontPresets } from '../typography';

import { nineSliceDimensions } from './constants';

interface ButtonConfig extends BaseConfig {
  label?: string;
  colour?: string;
  scale?: number;
  icon?: Phaser.GameObjects.Image | null;
  iconRight?: Phaser.GameObjects.Image | null;
  hotkey?: number | null;
  onClickHandler?: () => void;
}

export class ButtonElement extends BaseElement implements ButtonConfig {
  private imageButton!: Phaser.GameObjects.NineSlice;
  private imageHotkey!: Phaser.GameObjects.Image;
  private textLabel!: Phaser.GameObjects.Text;
  private keyHotkey!: Phaser.Input.Keyboard.Key;

  width = 300;
  height = 100;
  label: string = '';
  colour: string = 'blue';
  scale: number = 1.0;
  onClickHandler: () => void = () => {};
  icon?: Phaser.GameObjects.Image;
  iconRight?: Phaser.GameObjects.Image;
  hotkey?: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: Partial<ButtonConfig> = {}
  ) {
    super(scene, x, y);
    Object.assign(this, { ...this, ...config });
  }

  create() {
    super.create();

    this.imageButton = this.scene.add
      .nineslice(
        0,
        0,
        'kui',
        `${this.colour}/button03`,
        this.width,
        this.height,
        nineSliceDimensions.leftWidth,
        nineSliceDimensions.rightWidth,
        nineSliceDimensions.topHeight,
        nineSliceDimensions.bottomHeight
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setInteractive();

    this.textLabel = this.scene.add
      .text(0, 0, this.label, { ...fontPresets.body, color: '#fff' })
      .setOrigin(0.5, 0.5);

    this.add([this.imageButton, this.textLabel]);

    if (this.icon) {
      this.icon.setOrigin(0.5, 0.5);
      Phaser.Display.Align.In.Center(this.icon, this.imageButton);
      this.add(this.icon);
    }

    if (this.iconRight) {
      this.iconRight.setOrigin(0.5, 0.5);
      Phaser.Display.Align.In.RightCenter(this.iconRight, this.imageButton);
      this.add(this.iconRight);
    }

    this.createHotkey();
    this.createPointer();
    this.setIdleState();
    this.setScrollFactor(0);
    this.setDepth(RenderLayer.UI);
    this.setScale(this.scale);

    this.scene.add.existing(this);

    return this;
  }

  update(time: number, deltaTime: number) {
    if (!this.keyHotkey) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyHotkey)) {
      this.click();
      this.setPressedState();
    }

    if (Phaser.Input.Keyboard.JustUp(this.keyHotkey)) {
      this.setIdleState();
    }
  }

  createHotkey() {
    if (!this.hotkey || !this.scene.input.keyboard) {
      return;
    }

    this.keyHotkey = this.scene.input.keyboard.addKey(this.hotkey);
    const kenneyInputsFrame = keyToInputImage[this.hotkey];

    this.imageHotkey = this.scene.add
      .image(0, 0, 'inputs', kenneyInputsFrame)
      .setOrigin(0.5, 0.5);
    this.add(this.imageHotkey);
    Phaser.Display.Align.In.Center(this.imageHotkey, this.imageButton);
    this.imageHotkey.setPosition(this.width / 2 - 15, this.height / 2 - 15);
  }

  createPointer() {
    this.imageButton.on('pointerover', () => {
      this.setHoverState();
    });

    this.imageButton.on('pointerout', () => {
      this.setIdleState();
    });

    this.imageButton.on('pointerdown', () => {
      this.setPressedState();
      this.click();
    });

    this.imageButton.on('pointerup', () => {
      this.setHoverState();
    });
  }

  resetState() {
    this.textLabel.setY(0);
    this.imageButton.setY(0);
    this.imageButton.height = this.height;
    this.icon?.setY(0);
    this.icon?.setAlpha(1);
  }

  setIdleState() {
    this.resetState();
    this.imageButton.setFrame(`${this.colour}/button03`);
  }

  setHoverState() {
    this.resetState();
    this.imageButton.setFrame(`${this.colour}/button02`);
  }

  setPressedState() {
    this.resetState();

    this.textLabel.setY(nineSliceDimensions.dropBuffer);
    this.imageButton.setY(nineSliceDimensions.dropBuffer);
    this.icon?.setY(nineSliceDimensions.dropBuffer);
    this.icon?.setAlpha(0.9);
    this.imageButton.height = this.height - nineSliceDimensions.dropBuffer;
    this.imageButton.setFrame(`${this.colour}/button02_pressed`);
  }

  onClick(onClickHandler: () => void) {
    this.onClickHandler = onClickHandler;
    return this;
  }

  click() {
    this.onClickHandler();
    return this;
  }
}

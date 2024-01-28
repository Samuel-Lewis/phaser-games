import Phaser from 'phaser';

import { RenderLayer } from '../depth';

import { BaseConfig, BaseElement } from './base';
import { keyToInputImage } from './hotkey';
import { fontPresets } from './typography';

const topHeight = 12;
const bottomHeight = 12;
const leftWidth = 8;
const rightWidth = 8;
const dropBuffer = 2;

export type ButtonColour = 'blue' | 'green' | 'red' | 'yellow' | 'grey';
export type ButtonConfig = BaseConfig & {
  label?: string;
  colour?: ButtonColour;
  scale?: number;
  icon?: Phaser.GameObjects.Image | null;
  hotkey?: number | null;
  onClick?: () => void;
};

const defaultConfig: Required<ButtonConfig> = {
  width: 300,
  height: 75,
  colour: 'blue',
  label: '',
  scale: 1.0,
  onClick: () => {},
  hotkey: null,
  icon: null,
};

export class ButtonElement extends BaseElement {
  private imageButton!: Phaser.GameObjects.NineSlice;
  private imageHotkey!: Phaser.GameObjects.Image;
  private textLabel!: Phaser.GameObjects.Text;
  private keyHotkey!: Phaser.Input.Keyboard.Key;

  config: Required<ButtonConfig>;

  onClickHandler: () => void = () => {};

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,

    config: ButtonConfig = defaultConfig
  ) {
    const combinedConfig = { ...defaultConfig, ...config };
    super(scene, x, y, combinedConfig);

    this.config = combinedConfig;
    this.onClickHandler = this.config.onClick;
  }

  create() {
    super.create();

    this.imageButton = this.scene.add
      .nineslice(
        0,
        0,
        'kui',
        `${this.config.colour}/button03`,
        this.width,
        this.height,
        leftWidth,
        rightWidth,
        topHeight,
        bottomHeight
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setInteractive();

    this.textLabel = this.scene.add
      .text(0, 0, this.config.label, { ...fontPresets.body, color: '#fff' })
      .setOrigin(0.5, 0.5);

    this.add([this.imageButton, this.textLabel]);

    if (this.config.icon) {
      this.config.icon.setOrigin(0.5, 0.5);
      Phaser.Display.Align.In.Center(this.config.icon, this.imageButton);
      this.add(this.config.icon);
    }

    this.createHotkey();
    this.createPointer();
    this.setIdleState();
    this.setScrollFactor(0);
    this.setDepth(RenderLayer.UI);
    this.setScale(this.config.scale);

    this.scene.add.existing(this);

    return this;
  }

  update(time: number, deltaTime: number) {
    if (Phaser.Input.Keyboard.JustDown(this.keyHotkey)) {
      this.onClickHandler();
      this.setPressedState();
    }

    if (Phaser.Input.Keyboard.JustUp(this.keyHotkey)) {
      this.setIdleState();
    }
  }

  createHotkey() {
    if (!this.config.hotkey || !this.scene.input.keyboard) {
      return;
    }

    this.keyHotkey = this.scene.input.keyboard.addKey(this.config.hotkey);
    const kenneyInputsFrame = keyToInputImage[this.config.hotkey];

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
    });

    this.imageButton.on('pointerup', () => {
      this.setHoverState();
      this.onClickHandler();
    });
  }

  resetState() {
    this.textLabel.setY(0);
    this.imageButton.setY(0);
    this.imageButton.height = this.height;
    this.config.icon?.setY(0);
    this.config.icon?.setAlpha(1);
  }

  setIdleState() {
    this.resetState();
    this.imageButton.setFrame(`${this.config.colour}/button03`);
  }

  setHoverState() {
    this.resetState();
    this.imageButton.setFrame(`${this.config.colour}/button02`);
  }

  setPressedState() {
    this.resetState();

    this.textLabel.setY(dropBuffer);
    this.imageButton.setY(dropBuffer);
    this.config.icon?.setY(dropBuffer);
    this.config.icon?.setAlpha(0.9);
    this.imageButton.height = this.height - dropBuffer;
    this.imageButton.setFrame(`${this.config.colour}/button02_pressed`);
  }

  onClick(onClickHandler: () => void) {
    this.onClickHandler = onClickHandler;
    return this;
  }
}

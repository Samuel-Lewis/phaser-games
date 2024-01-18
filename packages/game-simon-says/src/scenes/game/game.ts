import Phaser from 'phaser';

import { Sequencer } from '@samuel-lewis/engine';

import { SceneKeys } from '../../keys';

enum Direction {
  Up = '⬆️',
  Right = '➡️',
  Down = '⬇️',
  Left = '⬅️',
}

const DELAY_INIT = 250;
const DELAY_MENU = 1500;

export class GameScene extends Phaser.Scene {
  private labelFps!: Phaser.GameObjects.Text;

  private observeMode: boolean = true;
  private currentPattern: Direction[] = [];
  private guessPosition = 0;
  private level = 1;

  private sequencer?: Sequencer;

  private labelCommunication!: Phaser.GameObjects.Text;
  private labelLevel!: Phaser.GameObjects.Text;

  private directions!: Record<
    Direction,
    {
      image: Phaser.GameObjects.Image;
      imagePressed: Phaser.GameObjects.Image;
      key?: Phaser.Input.Keyboard.Key;
      sound: Phaser.Sound.BaseSound;
    }
  >;

  constructor() {
    super(SceneKeys.Game);
  }

  preload() {
    const origin = window.location.origin;
    this.load.setBaseURL(origin);
    this.load.atlas(
      'keys',
      'common/ui/inputs-white.png',
      'common/ui/inputs.json'
    );

    this.load.audio('up', 'simon-says/audio/up.mp3');
    this.load.audio('down', 'simon-says/audio/down.mp3');
    this.load.audio('left', 'simon-says/audio/left.mp3');
    this.load.audio('right', 'simon-says/audio/right.mp3');
    this.load.audio('success', 'simon-says/audio/success.mp3');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // FPS label
    this.labelFps = this.add.text(10, 10, '');

    this.labelCommunication = this.add
      .text(width / 2, height / 2 - 300, '', {
        fontSize: '48px',
        fontFamily: 'pixel',
      })
      .setOrigin(0.5);

    this.labelLevel = this.add
      .text(width / 2, height - 128, '', {
        fontSize: '32px',
        fontFamily: 'pixel',
      })
      .setOrigin(0.5)
      .setAlign('center');

    this.directions = {
      [Direction.Up]: {
        image: this.add.image(0, 0, 'keys', 'arrow_up'),
        imagePressed: this.add.image(0, 0, 'keys', 'arrow_up_dark'),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        sound: this.sound.add('up'),
      },
      [Direction.Right]: {
        image: this.add.image(0, 0, 'keys', 'arrow_right'),
        imagePressed: this.add.image(0, 0, 'keys', 'arrow_right_dark'),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        sound: this.sound.add('right'),
      },
      [Direction.Down]: {
        image: this.add.image(0, 0, 'keys', 'arrow_down'),
        imagePressed: this.add.image(0, 0, 'keys', 'arrow_down_dark'),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        sound: this.sound.add('down'),
      },
      [Direction.Left]: {
        image: this.add.image(0, 0, 'keys', 'arrow_left'),
        imagePressed: this.add.image(0, 0, 'keys', 'arrow_left_dark'),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        sound: this.sound.add('left'),
      },
    };

    Object.entries(this.directions).forEach(
      ([direction, { key, image, imagePressed }]) => {
        image.setScale(4);
        imagePressed.setScale(4);
        imagePressed.setVisible(false);

        if (key) {
          const onDown = () => {
            const isLastGuess =
              this.guessPosition >= this.currentPattern.length - 1;
            if (!this.observeMode) {
              this.tryGuess(direction as Direction);
              this.buttonDown(direction as Direction, !isLastGuess);
            }
          };

          const onUp = () => {
            const isLastGuess =
              this.guessPosition >= this.currentPattern.length;
            if (!this.observeMode || isLastGuess) {
              this.buttonUp(direction as Direction);
            }
          };

          key.on('down', onDown);
          image.on('pointerdown', onDown);

          key.on('up', onUp);
          image.on('pointerup', onUp);
        }
      }
    );

    this.resize();
    this.scale.on('resize', this.resize, this);

    this.increasePattern();
  }

  getMaxPatternLength() {
    return 3 + this.level;
  }

  increasePattern() {
    const options = Object.values(Direction);

    if (this.currentPattern.length >= this.getMaxPatternLength()) {
      // Level up
      this.level++;
      this.currentPattern = [];
    }

    const randomIndex = Math.floor(Math.random() * options.length);
    const direction = options[randomIndex] ?? Direction.Up;
    this.currentPattern.push(direction);

    this.sound.play('success');

    this.sequencer = new Sequencer()
      .addStep({ duration: DELAY_INIT * 2 })
      .addStep({
        duration: DELAY_MENU,
        onEnter: () => {
          this.labelCommunication.text = 'Observe and Remember';
          // Reset all buttons
          Object.keys(this.directions).forEach((direction) => {
            this.buttonUp(direction as Direction);
          });
        },
        onExit: () => {
          this.labelCommunication.text = '';
        },
      });

    this.currentPattern.forEach((direction) => {
      this.sequencer?.addStep({ duration: this.getReplayDelay() }).addStep({
        duration: this.getReplayDelay(),
        onEnter: () => {
          this.buttonDown(direction);
        },
        onExit: () => {
          this.buttonUp(direction);
        },
      });
    });

    this.sequencer.addStep({ duration: DELAY_INIT }).addStep({
      duration: DELAY_MENU,
      onEnter: () => {
        this.labelCommunication.text = 'Your turn';
        this.startGuessing();
      },
      onExit: () => {
        this.labelCommunication.text = '';
      },
    });

    this.sequencer.start();
  }

  getReplayDelay() {
    const delay = 800 - this.level * 50;
    return delay;
  }

  resize() {
    this.positionElements();
  }

  positionElements() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    const keyOffset = 100;

    this.labelCommunication.setPosition(centerX, centerY - 300);
    this.labelLevel.setPosition(centerX, height - 128);

    this.directions[Direction.Up].image.setPosition(
      centerX,
      centerY - keyOffset
    );
    this.directions[Direction.Up].imagePressed.setPosition(
      centerX,
      centerY - keyOffset
    );

    this.directions[Direction.Right].image.setPosition(
      centerX + keyOffset,
      centerY
    );
    this.directions[Direction.Right].imagePressed.setPosition(
      centerX + keyOffset,
      centerY
    );

    this.directions[Direction.Down].image.setPosition(
      centerX,
      centerY + keyOffset
    );
    this.directions[Direction.Down].imagePressed.setPosition(
      centerX,
      centerY + keyOffset
    );

    this.directions[Direction.Left].image.setPosition(
      centerX - keyOffset,
      centerY
    );
    this.directions[Direction.Left].imagePressed.setPosition(
      centerX + -keyOffset,
      centerY
    );
  }

  buttonDown(direction: Direction, withSound = true) {
    this.directions[direction].image.setVisible(false);
    this.directions[direction].imagePressed.setVisible(true);
    if (withSound) {
      this.directions[direction].sound.play();
    }
  }

  buttonUp(direction: Direction) {
    this.directions[direction].image.setVisible(true);
    this.directions[direction].imagePressed.setVisible(false);
  }

  startGuessing() {
    this.observeMode = false;
    this.guessPosition = 0;
  }

  tryGuess(direction: Direction) {
    if (this.currentPattern[this.guessPosition] !== direction) {
      this.gameOver();
      return;
    }

    this.guessPosition++;

    if (this.guessPosition >= this.currentPattern.length) {
      this.observeMode = true;
      this.increasePattern();
    }
  }

  gameOver() {
    this.scene.start(SceneKeys.GameOver, { score: this.level - 1 });
  }

  update(time: number, delta: number): void {
    this.labelLevel.text =
      `Level: ${this.level}\n\n` + this.currentPattern.join(' ');

    if (this.sequencer) {
      this.sequencer.update(time, delta);
    }

    // FPS counter
    const fps = Math.floor(1000 / delta);
    this.labelFps.setText(`FPS: ${fps}`);
  }
}

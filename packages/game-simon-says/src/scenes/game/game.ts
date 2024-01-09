import Phaser from 'phaser';

import { SceneKeys } from '../../keys';
import { Sequencer } from '../../lib/sequencer';

enum Direction {
  Up = '⬆️',
  Right = '➡️',
  Down = '⬇️',
  Left = '⬅️',
}

export class GameScene extends Phaser.Scene {
  private labelFps!: Phaser.GameObjects.Text;

  private observeMode: boolean = true;
  private currentPattern: Direction[] = [];
  private guessPosition = 0;
  private level = 1;

  private sequencer?: Sequencer;

  private labelCommunication!: Phaser.GameObjects.Text;
  private labelPattern!: Phaser.GameObjects.Text;

  private directions!: Record<
    Direction,
    {
      image: Phaser.GameObjects.Image;
      imagePressed: Phaser.GameObjects.Image;
      key?: Phaser.Input.Keyboard.Key;
      // sound: Phaser.Sound.BaseSound;
    }
  >;

  constructor() {
    super(SceneKeys.Game);
  }

  preload() {
    this.load.setBaseURL('http://localhost:3000');
    this.load.atlas(
      'keys',
      'common/ui/inputs-white.png',
      'common/ui/inputs.json'
    );
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

    this.labelPattern = this.add
      .text(width / 2, height - 128, '', {
        fontSize: '32px',
        fontFamily: 'pixel',
      })
      .setOrigin(0.5);

    this.directions = {
      [Direction.Up]: {
        image: this.add.image(0, 0, 'keys', 'arrow_up'),
        imagePressed: this.add.image(0, 0, 'keys', 'arrow_up_dark'),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      },
      [Direction.Right]: {
        image: this.add.image(0, 0, 'keys', 'arrow_right'),
        imagePressed: this.add.image(0, 0, 'keys', 'arrow_right_dark'),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      },
      [Direction.Down]: {
        image: this.add.image(0, 0, 'keys', 'arrow_down'),
        imagePressed: this.add.image(0, 0, 'keys', 'arrow_down_dark'),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      },
      [Direction.Left]: {
        image: this.add.image(0, 0, 'keys', 'arrow_left'),
        imagePressed: this.add.image(0, 0, 'keys', 'arrow_left_dark'),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      },
    };

    Object.entries(this.directions).forEach(
      ([direction, { key, image, imagePressed }]) => {
        image.setScale(4);
        imagePressed.setScale(4);
        imagePressed.setVisible(false);

        if (key) {
          key.on('down', () => {
            if (!this.observeMode) {
              this.buttonDown(direction as Direction);
              this.tryGuess(direction as Direction);
            }
          });

          key.on('up', () => {
            if (!this.observeMode) {
              this.buttonUp(direction as Direction);
            }
          });
        }
      }
    );

    this.resize();
    this.scale.on('resize', this.resize, this);

    this.increasePattern();
  }

  increasePattern() {
    const options = Object.values(Direction);

    // TODO: Something something level up

    const randomIndex = Math.floor(Math.random() * options.length);
    const direction = options[randomIndex] ?? Direction.Up;
    this.currentPattern.push(direction);

    this.sequencer = new Sequencer()
      .add({ duration: this.getReplayDelay() })
      .add({
        duration: 2000,
        onEnter: () => {
          this.labelCommunication.text = 'Observe and Remember';
        },
        onExit: () => {
          this.labelCommunication.text = '';
        },
      });

    this.currentPattern.forEach((direction) => {
      this.sequencer?.add({ duration: this.getReplayDelay() }).add({
        duration: this.getReplayDelay(),
        onEnter: () => {
          this.buttonDown(direction);
        },
        onExit: () => {
          this.buttonUp(direction);
        },
      });
    });

    this.sequencer.add({ duration: this.getReplayDelay() }).add({
      duration: 2000,
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
    // TODO: Something something about level
    return 1000;
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
    this.labelPattern.setPosition(centerX, height - 128);

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

  buttonDown(direction: Direction) {
    this.directions[direction].image.setVisible(false);
    this.directions[direction].imagePressed.setVisible(true);
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

    console.log(
      `CORRECT: ${this.guessPosition} / ${this.currentPattern.length}`
    );

    if (this.guessPosition >= this.currentPattern.length) {
      this.observeMode = true;
      this.increasePattern();
    }
  }

  gameOver() {
    this.scene.start(SceneKeys.GameOver);
  }

  update(time: number, delta: number): void {
    const { width, height } = this.sys.game.canvas;

    this.labelPattern.text = this.currentPattern.join(' ');

    if (this.sequencer) {
      this.sequencer.update(time, delta);
    }

    // FPS counter
    const fps = Math.floor(1000 / delta);
    this.labelFps.setText(`FPS: ${fps}`);
  }
}

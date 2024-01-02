import Phaser from "phaser";

import { SceneKeys } from "../keys";

const enum Direction {
  Up = "⬆️",
  Right = "➡️",
  Down = "⬇️",
  Left = "⬅️",
}

const pressSpeed = 1000;

export class GameScene extends Phaser.Scene {
  private labelFps!: Phaser.GameObjects.Text;

  private observeMode: boolean = false;
  private currentPattern: Direction[] = [];

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

  private imageUp!: Phaser.GameObjects.Image;
  private imageRight!: Phaser.GameObjects.Image;
  private imageDown!: Phaser.GameObjects.Image;
  private imageLeft!: Phaser.GameObjects.Image;
  private imageUpPressed!: Phaser.GameObjects.Image;
  private imageRightPressed!: Phaser.GameObjects.Image;
  private imageDownPressed!: Phaser.GameObjects.Image;
  private imageLeftPressed!: Phaser.GameObjects.Image;

  private keyUp?: Phaser.Input.Keyboard.Key;
  private keyRight?: Phaser.Input.Keyboard.Key;
  private keyDown?: Phaser.Input.Keyboard.Key;
  private keyLeft?: Phaser.Input.Keyboard.Key;

  constructor() {
    super(SceneKeys.Game);
  }

  preload() {
    this.load.setBaseURL("http://localhost:3000");
    this.load.atlas(
      "keys",
      "common/ui/inputs-white.png",
      "common/ui/inputs.json"
    );
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // FPS label
    this.labelFps = this.add.text(10, 10, "");

    this.labelCommunication = this.add
      .text(width / 2, height / 2 - 300, "Observe", {
        fontSize: "48px",
        fontFamily: "pixel",
      })
      .setOrigin(0.5);

    this.labelPattern = this.add
      .text(width / 2, height - 128, "", {
        fontSize: "32px",
        fontFamily: "pixel",
      })
      .setOrigin(0.5);

    this.directions = {
      [Direction.Up]: {
        image: this.add.image(width / 2, height / 2 - 100, "keys", "arrow_up"),
        imagePressed: this.add.image(
          width / 2,
          height / 2 - 100,
          "keys",
          "arrow_up_dark"
        ),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      },
      [Direction.Right]: {
        image: this.add.image(
          width / 2,
          height / 2 - 100,
          "keys",
          "arrow_right"
        ),
        imagePressed: this.add.image(
          width / 2,
          height / 2 - 100,
          "keys",
          "arrow_right_dark"
        ),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      },
      [Direction.Down]: {
        image: this.add.image(width / 2, height / 2 - 100, "keys", "arrow_up"),
        imagePressed: this.add.image(
          width / 2,
          height / 2 - 100,
          "keys",
          "arrow_up_dark"
        ),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      },
      [Direction.Left]: {
        image: this.add.image(width / 2, height / 2 - 100, "keys", "arrow_up"),
        imagePressed: this.add.image(
          width / 2,
          height / 2 - 100,
          "keys",
          "arrow_up_dark"
        ),
        key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      },
    };

    this.directions[Direction.Right] = {
      image: this.add.image(width / 2 + 100, height / 2, "keys", "arrow_right"),
      imagePressed: this.add.image(
        width / 2 + 100,
        height / 2,
        "keys",
        "arrow_right_dark"
      ),
      key: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
    };

    // this.imageUp = this.add
    //   .image(width / 2, height / 2 - 100, "keys", "arrow_up")
    //   .setScale(4);
    // this.imageUpPressed = this.add
    //   .image(width / 2, height / 2 - 100, "keys", "arrow_up_dark")
    //   .setScale(4)
    //   .setVisible(false);
    // this.imageRight = this.add
    //   .image(width / 2 + 100, height / 2, "keys", "arrow_right")
    //   .setScale(4);
    // this.imageRightPressed = this.add
    //   .image(width / 2 + 100, height / 2, "keys", "arrow_right_dark")
    //   .setScale(4)
    //   .setVisible(false);
    // this.imageDown = this.add
    //   .image(width / 2, height / 2 + 100, "keys", "arrow_down")
    //   .setScale(4);
    // this.imageDownPressed = this.add
    //   .image(width / 2, height / 2 + 100, "keys", "arrow_down_dark")
    //   .setScale(4)
    //   .setVisible(false);
    // this.imageLeft = this.add
    //   .image(width / 2 - 100, height / 2, "keys", "arrow_left")
    //   .setScale(4);
    // this.imageLeftPressed = this.add
    //   .image(width / 2 - 100, height / 2, "keys", "arrow_left_dark")
    //   .setScale(4)
    //   .setVisible(false);

    this.keyUp = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyRight = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.keyDown = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.keyLeft = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
  }

  showButtonPress(direction: Direction) {}

  playPattern() {}

  update(time: number, delta: number): void {
    const { width, height } = this.sys.game.canvas;

    if (this.keyUp?.isDown) {
      this.showButtonPress(Direction.Up);
    }

    if (this.keyRight?.isDown) {
      this.showButtonPress(Direction.Right);
    }

    if (this.keyDown?.isDown) {
      this.showButtonPress(Direction.Down);
    }

    if (this.keyLeft?.isDown) {
      this.showButtonPress(Direction.Left);
    }

    this.labelPattern.text = this.currentPattern.join(" ");

    // FPS counter
    const fps = Math.floor(1000 / delta);
    this.labelFps.setText(`FPS: ${fps}`);
  }
}

import Phaser from 'phaser';

const PLAYER_SPEED = 600;
const PLAYER_JUMP_SPEED = 1000;

export class Player extends Phaser.Physics.Arcade.Image {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyJump!: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'sprites', 'character/roundRed');
  }

  create() {
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.createControls();

    return this;
  }

  createControls() {
    if (!this.scene.input.keyboard) {
      return;
    }
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.keyJump = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update(time: number, deltaTime: number) {
    this.setVelocityX(0);

    // Left right movement
    if (this.cursors.left.isDown) {
      this.setVelocityX(-PLAYER_SPEED);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(PLAYER_SPEED);
    }

    // Jump
    if (this.keyJump.isDown && this.body?.touching.down) {
      console.log('JUMP');
      this.setVelocityY(-PLAYER_JUMP_SPEED);
    }
  }
}

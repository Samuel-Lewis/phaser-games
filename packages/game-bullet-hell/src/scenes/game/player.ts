import Phaser from 'phaser';

import { GameScene } from './game';

Phaser.GameObjects.Container;

export class PlayerObject extends Phaser.GameObjects.Container {
  scene: GameScene;

  private spriteShip?: Phaser.Physics.Arcade.Sprite;
  private spriteShield1?: Phaser.GameObjects.Sprite;
  private spriteShield2?: Phaser.GameObjects.Sprite;
  private spriteShield3?: Phaser.GameObjects.Sprite;

  private spriteDamage1?: Phaser.GameObjects.Sprite;
  private spriteDamage2?: Phaser.GameObjects.Sprite;
  private spriteDamage3?: Phaser.GameObjects.Sprite;

  private keyLeft?: Phaser.Input.Keyboard.Key;
  private keyRight?: Phaser.Input.Keyboard.Key;
  private keyShoot?: Phaser.Input.Keyboard.Key;

  private playerSpeed = 50;
  private playerShootCoolDown = 500;
  private playerShootTimer = 0;

  private health = 4;
  private lives = 3;
  private shieldLevel = 0;

  constructor(scene: GameScene) {
    super(scene, 0, 0);
    this.scene = scene;
  }

  create() {
    this.spriteShip = this.scene.physics.add.sprite(
      0,
      0,
      'sprites',
      'playerShip1_blue'
    );

    this.spriteShield1 = this.scene.add.sprite(0, -8, 'sprites', 'shield1');
    this.spriteShield2 = this.scene.add.sprite(0, -8, 'sprites', 'shield2');
    this.spriteShield3 = this.scene.add.sprite(0, 0, 'sprites', 'shield3');
    this.updateShield();

    this.spriteDamage1 = this.scene.add.sprite(
      0,
      0,
      'sprites',
      'playerShip1_damage1'
    );
    this.spriteDamage2 = this.scene.add.sprite(
      0,
      0,
      'sprites',
      'playerShip1_damage2'
    );
    this.spriteDamage3 = this.scene.add.sprite(
      0,
      0,
      'sprites',
      'playerShip1_damage3'
    );
    this.updateDamage();

    this.add([
      this.spriteShip,
      this.spriteShield1,
      this.spriteShield2,
      this.spriteShield3,
      this.spriteDamage1,
      this.spriteDamage2,
      this.spriteDamage3,
    ]);
    this.scene.physics.add.existing(this.spriteShip);
    this.scene.add.existing(this);
    this.scene.groupPlayers.add(this);

    const { width, height } = this.scene.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.x = centerX;
    this.y = height - 100;

    this.keyLeft = this.scene.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.keyRight = this.scene.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.keyShoot = this.scene.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  move(time: number, delta: number, moveDirection: number) {
    const { width, height } = this.scene.sys.game.canvas;

    const moveSpeed = this.playerSpeed * moveDirection;
    const newX = Phaser.Math.Clamp(this.x + moveSpeed, 0, width);

    // Tween to move the player
    this.scene.tweens.add({
      targets: this,
      x: newX,
      duration: 100,
      ease: 'Linear',
    });
  }

  shoot(time: number, delta: number) {
    if (time < this.playerShootTimer) {
      // In cooldown
      return;
    }

    this.playerShootTimer = time + this.playerShootCoolDown;

    // Launch a laser
    const laser = this.scene.physics.add
      .image(this.x, this.y, 'sprites', 'laserBlue01')
      .setOrigin(0.5, 0.5);

    this.scene.tweens.add({
      targets: laser,
      y: -100,
      duration: 500,
      ease: 'Linear',
      onComplete: () => {
        laser.destroy();
      },
    });

    this.scene.groupPlayerProjectiles.add(laser);

    return laser;
  }

  updateShield() {
    this.spriteShield1?.setVisible(false).setActive(false);
    this.spriteShield2?.setVisible(false).setActive(false);
    this.spriteShield3?.setVisible(false).setActive(false);

    if (this.shieldLevel === 1) {
      this.spriteShield1?.setVisible(true).setActive(true);
    } else if (this.shieldLevel === 2) {
      this.spriteShield2?.setVisible(true).setActive(true);
    } else if (this.shieldLevel === 3) {
      this.spriteShield3?.setVisible(true).setActive(true);
    }
  }

  updateDamage() {
    this.spriteDamage1?.setVisible(false).setActive(false);
    this.spriteDamage2?.setVisible(false).setActive(false);
    this.spriteDamage3?.setVisible(false).setActive(false);

    if (this.health === 3) {
      this.spriteDamage1?.setVisible(true).setActive(true);
    } else if (this.health === 2) {
      this.spriteDamage2?.setVisible(true).setActive(true);
    } else if (this.health === 1) {
      this.spriteDamage3?.setVisible(true).setActive(true);
    }
  }

  increaseShield(amount = 1) {
    this.shieldLevel = Phaser.Math.Clamp(this.shieldLevel + amount, 0, 3);
    this.updateShield();
  }

  damage(amount: number = 1) {
    if (this.shieldLevel > 0) {
      this.shieldLevel = Phaser.Math.Clamp(this.shieldLevel - amount, 0, 3);
      this.updateShield();
      return;
    }

    this.health -= amount;
    if (this.health <= 0) {
      this.scene.gameOver();
    }
    this.updateDamage();
  }

  update(time: number, delta: number) {
    // Input control
    let moveDirection = 0;
    if (this.keyLeft?.isDown) {
      moveDirection -= 1;
    } else if (this.keyRight?.isDown) {
      moveDirection += 1;
    }
    this.move(time, delta, moveDirection);

    if (this.keyShoot?.isDown) {
      this.shoot(time, delta);
    }
  }
}

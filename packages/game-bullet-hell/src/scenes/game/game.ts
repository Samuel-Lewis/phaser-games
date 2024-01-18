import Phaser from 'phaser';

import { Sequencer, StepType } from '@samuel-lewis/engine';

import { SceneKeys } from '../../keys';

import { EnemyObject } from './enemy';
import { PlayerObject } from './player';
import { PowerObject } from './powerup';
import { Wave } from './waves';

export class GameScene extends Phaser.Scene {
  private labelFps!: Phaser.GameObjects.Text;

  private imageBackground!: Phaser.GameObjects.TileSprite;

  private labelCommunication!: Phaser.GameObjects.Text;

  public groupPowerUps!: Phaser.Physics.Arcade.Group;
  public groupEnemies!: Phaser.Physics.Arcade.Group;
  public groupEnemyProjectiles!: Phaser.Physics.Arcade.Group;
  public groupPlayers!: Phaser.Physics.Arcade.Group;
  public groupPlayerProjectiles!: Phaser.Physics.Arcade.Group;

  private player!: PlayerObject;

  private waves: Sequencer[] = [];
  private wave: number = -1;
  private waveInProgress: boolean = false;

  private score = 0;

  constructor() {
    super(SceneKeys.Game);
  }

  preload() {
    const origin = window.location.origin;
    this.load.setBaseURL(origin);
    this.load.atlas(
      'sprites',
      'bullet-hell/graphics/sprites.png',
      'bullet-hell/graphics/sprites.json'
    );

    this.load.image('background', 'bullet-hell/graphics/bg_darkPurple.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    this.imageBackground = this.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0);

    this.groupPowerUps = this.physics.add.group();
    this.groupEnemies = this.physics.add.group();
    this.groupEnemyProjectiles = this.physics.add.group();
    this.groupPlayers = this.physics.add.group();
    this.groupPlayerProjectiles = this.physics.add.group();

    this.player = new PlayerObject(this);
    this.player.create();

    // FPS label
    this.labelFps = this.add.text(10, 10, '');

    this.labelCommunication = this.add
      .text(centerX, centerY, 'Click to Start', {
        fontSize: '96px',
        color: '#ffffff',
        fontFamily: 'future, impact, Verdana, sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setAlign('center');

    this.input.on('pointerdown', () => {
      if (this.wave === -1) {
        this.nextWave();
      }
    });

    const wave1 = new Wave(this)
      .featureTriangle({ postFeatureDelay: 4000 })
      .featureSlant({ units: 3 });
    const wave2 = new Wave(this)
      .featureTriangle({ units: 5 })
      .featurePowerUp()
      .featureSlant({ units: 5 });

    const wave3 = new Wave(this)
      .featureRandom({ postFeatureDelay: 1000, units: 2 })
      .featureRandom({ postFeatureDelay: 1000, units: 3 })
      .featurePowerUp()
      .featureRandom({ postFeatureDelay: 1000, units: 2 })
      .featureRandom({ postFeatureDelay: 1000, units: 3 });

    const wave4 = new Wave(this)
      .featureSlant({ units: 5 })
      .featureSlant({ units: 5, reverse: true })
      .featurePowerUp()
      .featureSlant({ units: 5 })
      .featureSlant({ units: 5, reverse: true });

    [wave1, wave2, wave3, wave4].forEach((wave) => {
      this.waves.push(wave.getSequencer());
    });

    this.waves.map((wave) =>
      wave
        .unshift({
          type: StepType.STEP,
          duration: 1000,
          onEnter: () => {
            this.labelCommunication.setText(`Wave ${this.wave + 1}`);
          },
          onExit: () => {
            this.labelCommunication.setText('');
            this.waveInProgress = true;
          },
        })
        .addPause({
          onUpdate: (resume) => {
            if (this.isWaveFree()) {
              resume();
            }
          },
        })
        .addStep({
          duration: 1000,
          onExit: () => {
            this.waveInProgress = false;
            this.nextWave();
          },
        })
    );
  }

  nextWave() {
    if (this.waveInProgress) {
      return;
    }

    this.wave++;

    const next = this.waves[this.wave];
    if (!next) {
      this.gameOver();
      return;
    }

    this.waveInProgress = true;
    next.reset().start();
  }

  gameOver() {
    this.scene.start(SceneKeys.GameOver, { score: this.score });
  }

  isWaveFree() {
    return (
      this.groupEnemies.getLength() === 0 &&
      this.groupEnemyProjectiles.getLength() === 0 &&
      this.groupPowerUps.getLength() === 0
    );
  }

  update(time: number, delta: number): void {
    // Scrolling background
    this.imageBackground.tilePositionY -= 1;

    this.player.update(time, delta);

    if (this.waves[this.wave] && this.waveInProgress) {
      this.waves[this.wave]?.update(time, delta);
    }

    this.physics.collide(
      this.groupEnemies,
      this.groupPlayerProjectiles,
      (enemy, bullet) => {
        enemy.destroy();
        bullet.destroy();
        if (!(enemy instanceof EnemyObject)) {
          return;
        }
        this.score += enemy.getScore();
      }
    );

    this.physics.collide(
      this.groupPlayers,
      this.groupPowerUps,
      (player, power) => {
        if (!(power instanceof PowerObject)) {
          return;
        }
        if (!(player instanceof PlayerObject)) {
          return;
        }

        power.applyEffect(player);
        power.destroy();
      }
    );

    this.physics.collide(
      this.groupEnemies,
      this.groupPlayers,
      (enemy, player) => {
        if (!(enemy instanceof EnemyObject)) {
          return;
        }
        if (!(player instanceof PlayerObject)) {
          return;
        }

        player.damage();
        enemy.destroy();

        this.score += enemy.getScore();

        this.cameras.main.shake(250, 0.005);
      }
    );

    // FPS counter
    const fps = Math.floor(1000 / delta);
    this.labelFps.setText(`FPS: ${fps}`);
  }
}

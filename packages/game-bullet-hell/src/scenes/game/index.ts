import Phaser from 'phaser';

import { Sequencer, StepType } from '@samuel-lewis/engine';

import { RenderLayer, SceneKeys } from '../../keys';
import { BaseScene } from '../base';

import { CooldownBar } from './cooldown-bar';
import { EnemyObject } from './enemies/enemy';
import { PlayerObject } from './player';
import { PowerObject } from './power-up';
import { getWaveData } from './waves/data';
import { Wave } from './waves/wave';

export class GameScene extends BaseScene {
  private labelCommunication!: Phaser.GameObjects.Text;

  public groupPowerUps!: Phaser.Physics.Arcade.Group;
  public groupEnemies!: Phaser.Physics.Arcade.Group;
  public groupEnemyProjectiles!: Phaser.Physics.Arcade.Group;
  public groupPlayers!: Phaser.Physics.Arcade.Group;
  public groupPlayerProjectiles!: Phaser.Physics.Arcade.Group;

  private cooldownBar!: CooldownBar;
  private player!: PlayerObject;

  private waves: Sequencer[] = [];
  private wave: number = -1;
  private waveInProgress: boolean = false;

  private score = 0;

  constructor() {
    super(SceneKeys.Game);
  }

  init() {
    this.score = 0;
    this.wave = -1;
    this.waveInProgress = false;
  }

  create() {
    super.create();
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.groupPowerUps = this.physics.add.group();
    this.groupEnemies = this.physics.add.group();
    this.groupEnemyProjectiles = this.physics.add.group();
    this.groupPlayers = this.physics.add.group();
    this.groupPlayerProjectiles = this.physics.add.group();

    this.player = new PlayerObject(this).create();
    this.cooldownBar = new CooldownBar(this).create();

    this.player.onShoot((shootCooldown) => {
      this.cooldownBar.fire(shootCooldown);
    });

    this.labelCommunication = this.add
      .text(centerX, centerY, '', {
        fontSize: '96px',
        color: '#ffffff',
        fontFamily: 'future, Verdana, sans-serif',
      })
      .setOrigin(0.5, 0.5)
      .setAlign('center')
      .setDepth(RenderLayer.UI);

    const waveData = getWaveData(this);

    waveData.forEach((wave) => {
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

    this.nextWave();
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

  update(time: number, delta: number) {
    super.update(time, delta);
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

    this.physics.collide(
      this.groupPlayers,
      this.groupEnemyProjectiles,
      (player, projectile) => {
        if (!(player instanceof PlayerObject)) {
          return;
        }

        player.damage();
        projectile.destroy();

        this.cameras.main.shake(250, 0.005);
      }
    );
  }
}

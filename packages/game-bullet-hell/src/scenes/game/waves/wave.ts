import Phaser from 'phaser';

import {
  Sequencer,
  evenInSegment,
  randomInSegments,
} from '@samuel-lewis/engine';

import { GameScene } from '..';
import { EnemyType, enemyRegistry } from '../enemies';
import { PowerObject } from '../power-up';

type FeatureOptions = {
  enemyType?: EnemyType;
  units?: number;
  delay?: number;
  postFeatureDelay?: number;
};

const defaultFeatureOptions: Required<FeatureOptions> = {
  enemyType: 'marcher',
  units: 3,
  delay: 200,
  postFeatureDelay: 1000,
};

export class Wave {
  sequencer: Sequencer;
  private scene: GameScene;

  constructor(scene: GameScene) {
    this.sequencer = new Sequencer();
    this.scene = scene;
    return this;
  }

  getSequencer() {
    return this.sequencer;
  }

  featurePowerUp() {
    this.sequencer.addStep({
      duration: 3000,
      onEnter: () => {
        const randomX = Phaser.Math.Between(
          0,
          this.scene.sys.game.canvas.width
        );
        new PowerObject(this.scene, randomX).create();
      },
    });
    return this;
  }

  featureRandom(options: FeatureOptions = defaultFeatureOptions) {
    const { units, delay, postFeatureDelay, enemyType } = {
      ...defaultFeatureOptions,
      ...options,
    };

    const { width } = this.scene.sys.game.canvas;
    const xPositions = randomInSegments(0, width, units);

    const EnemyClass = enemyRegistry[enemyType];

    this.sequencer
      .addStep({
        duration: delay,
        onEnter: () => {
          for (let i = 0; i < units; i++) {
            new EnemyClass(this.scene, xPositions[i]).create();
          }
        },
      })
      .addStep({
        duration: postFeatureDelay,
      });
    return this;
  }

  featureSlant(
    options: FeatureOptions & { reverse?: boolean } = defaultFeatureOptions
  ) {
    const {
      units,
      delay,
      postFeatureDelay,
      reverse = false,
      enemyType,
    } = { ...defaultFeatureOptions, ...options };

    const { width } = this.scene.sys.game.canvas;
    const xPositions = evenInSegment(0, width, units);
    const EnemyClass = enemyRegistry[enemyType];

    for (let i = 0; i < units; i++) {
      const xPosition = reverse ? xPositions[units - i - 1] : xPositions[i];
      this.sequencer.addStep({
        duration: delay,
        onEnter: () => {
          new EnemyClass(this.scene, xPosition).create();
        },
      });
    }

    this.sequencer.addStep({
      duration: postFeatureDelay,
    });
    return this;
  }

  featureTriangle(options: FeatureOptions = defaultFeatureOptions) {
    const { units, delay, postFeatureDelay, enemyType } = {
      ...defaultFeatureOptions,
      ...options,
    };

    const { width } = this.scene.sys.game.canvas;
    const xPositions = evenInSegment(0, width, units);

    const layers = Math.ceil(units / 2);

    const mid = Math.floor(xPositions.length / 2);
    const EnemyClass = enemyRegistry[enemyType];

    // First forward layer
    const midPosition = xPositions[mid];
    this.sequencer.addStep({
      duration: delay,
      onEnter: () => {
        new EnemyClass(this.scene, midPosition).create();
      },
    });

    for (let i = 1; i < layers; i++) {
      this.sequencer.addStep({
        duration: delay,
        onEnter: () => {
          new EnemyClass(this.scene, xPositions[mid - i]).create();
          new EnemyClass(this.scene, xPositions[mid + i]).create();
        },
      });
    }

    this.sequencer.addStep({
      duration: postFeatureDelay,
    });
    return this;
  }
}

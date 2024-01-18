import { GameScene } from '..';

import { Wave } from './wave';

export const getWaveData = (scene: GameScene) => {
  const allWaves: Wave[] = [];

  allWaves.push(
    new Wave(scene)
      .featureTriangle({ postFeatureDelay: 4000 })
      .featureSlant({ units: 3 })
  );

  allWaves.push(
    new Wave(scene)
      .featureTriangle({ units: 5 })
      .featurePowerUp()
      .featureSlant({ units: 5 })
  );

  allWaves.push(
    new Wave(scene)
      .featureRandom({ postFeatureDelay: 1000, units: 2 })
      .featureRandom({ postFeatureDelay: 1000, units: 3 })
      .featurePowerUp()
      .featureRandom({ postFeatureDelay: 1000, units: 2 })
      .featureRandom({ postFeatureDelay: 1000, units: 3 })
  );

  allWaves.push(
    new Wave(scene)
      .featureSlant({ units: 5 })
      .featureSlant({ units: 5, reverse: true })
      .featurePowerUp()
      .featureSlant({ units: 5 })
      .featureSlant({ units: 5, reverse: true })
  );

  allWaves.push(
    new Wave(scene)
      .featureSlant({ units: 2, enemyType: 'shooter', delay: 500 })
      .featurePowerUp()
      .featureRandom({ units: 3, postFeatureDelay: 4000 })
      .featureSlant({ units: 2, enemyType: 'shooter' })
  );

  return allWaves;
};

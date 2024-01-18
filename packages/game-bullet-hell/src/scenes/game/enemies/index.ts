import { EnemyMarcherObject } from './enemy-marcher';
import { EnemyShooterObject } from './enemy-shooter';

export const enemyRegistry = {
  marcher: EnemyMarcherObject,
  shooter: EnemyShooterObject,
};

export type EnemyType = keyof typeof enemyRegistry;

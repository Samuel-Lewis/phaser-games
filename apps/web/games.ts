import { Game } from '@samuel-lewis/engine';
import { BulletHellGame } from '@samuel-lewis/game-bullet-hell';
import { NetworkGame, WavesGame } from '@samuel-lewis/game-dots';
import { SimonSaysGame } from '@samuel-lewis/game-simon-says';
import { ExampleGame } from '@samuel-lewis/game-template';

// TODO: This should not import from engine

export const games: Game[] = [
  BulletHellGame,
  SimonSaysGame,
  NetworkGame,
  WavesGame,
  ExampleGame,
];

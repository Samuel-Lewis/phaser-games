import { Game } from "@samuel-lewis/engine";
import { NetworkGame, WavesGame } from "@samuel-lewis/game-dots";
import { SimonSaysGame } from "@samuel-lewis/game-simon-says";
import { ExampleGame } from "@samuel-lewis/game-template";

// TODO: This should not import from engine

export const games: Game[] = [
  SimonSaysGame,
  NetworkGame,
  WavesGame,
  ExampleGame,
];

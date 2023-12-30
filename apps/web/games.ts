import { Game } from "@samuel-lewis/engine";
import { NetworkGame, WavesGame } from "@samuel-lewis/game-dots";
import { ExampleGame } from "@samuel-lewis/game-template";

// TODO: This should not import from engine

export const games: Game[] = [ExampleGame, NetworkGame, WavesGame];

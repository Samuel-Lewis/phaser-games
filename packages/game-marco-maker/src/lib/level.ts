import { TILES_HIGH, TILES_WIDE } from '../constants';

import { usefulTileIds } from './tile-data';

export class Level {
  public width: number;
  public height: number;
  public tiles: number[];
  public tints: (number | null)[];

  constructor(width = TILES_WIDE, height = TILES_HIGH) {
    const levelData = this.createDefaultLevel(width, height);

    this.width = levelData.width;
    this.height = levelData.height;
    this.tiles = levelData.tiles;
    this.tints = levelData.tints;
  }

  deserialise(serialisedLevel: string) {
    return Level.deserialise(serialisedLevel);
  }

  serialise() {
    return Level.serialise(this);
  }

  static serialise(level: Level) {
    return JSON.stringify({
      width: level.width,
      height: level.height,
      tiles: level.tiles,
      tints: level.tints,
    });
  }

  static deserialise(serialisedLevel: string) {
    return JSON.parse(serialisedLevel);
  }

  static fromSerialised(serialisedLevel: string) {
    const levelData = Level.deserialise(serialisedLevel);
    const level = new Level();
    level.width = levelData.width;
    level.height = levelData.height;
    level.tiles = levelData.tiles;
    level.tints = levelData.tints;
    return level;
  }

  createDefaultLevel = (
    width: number = TILES_WIDE,
    height: number = TILES_HIGH
  ) => {
    const totalLength = width * height;
    const tiles: number[] = new Array(totalLength).fill(-1);
    const tints: (number | null)[] = new Array(totalLength).fill(null);

    // Line the outside with walls
    for (let x = 0; x < width; x++) {
      tiles[x] = usefulTileIds.diagonal;
      tiles[totalLength - x - 1] = usefulTileIds.diagonal;
    }
    for (let y = 0; y < height; y++) {
      tiles[y * width] = usefulTileIds.diagonal;
      tiles[y * width + width - 1] = usefulTileIds.diagonal;
    }

    return {
      tiles,
      tints,
      width,
      height,
    };
  };

  cordsToIndex(x: number, y: number) {
    return y * this.width + x;
  }

  indexToCords(i: number) {
    return {
      x: i % this.width,
      y: Math.floor(i / this.width),
    };
  }

  tilesTo2DArray() {
    const tiles: number[][] = [];
    for (let y = 0; y < this.height; y++) {
      tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        const index = this.cordsToIndex(x, y);
        const tile = this.tiles[index];
        if (tile) {
          tiles[y]![x] = tile;
        }
      }
    }
    return tiles;
  }

  dataArray() {
    const data = [];
    for (let index = 0; index < this.tiles.length; index++) {
      const { x, y } = this.indexToCords(index);

      data.push({
        index,
        x,
        y,
        tileId: this.tiles[index] ?? -1,
        tintId: this.tints[index] ?? null,
      });
    }
    return data;
  }
}

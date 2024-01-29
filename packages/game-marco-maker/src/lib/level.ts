import Phaser from 'phaser';

import { TILES_HIGH, TILES_WIDE } from '../constants';

import { usefulTileIds } from './tile-data';
import { tintData } from './tint-data';

export class Level {
  public width: number = TILES_WIDE;
  public height: number = TILES_HIGH;
  public tileIds: number[];
  public tintIds: (number | null)[];

  public startTile: { x: number; y: number; index: number };
  public endTile: { x: number; y: number; index: number };

  constructor(serialisedLevel?: string) {
    const levelData = serialisedLevel
      ? this.deserialise(serialisedLevel)
      : this.createDefaultLevel(this.width, this.height);

    this.width = levelData.width;
    this.height = levelData.height;
    this.tileIds = levelData.tiles;
    this.tintIds = levelData.tints;

    this.startTile = this.findTile(usefulTileIds.flag);
    this.endTile = this.findTile(usefulTileIds.chest);
  }

  deserialise(serialisedLevel: string) {
    return JSON.parse(serialisedLevel);
  }

  serialise() {
    return JSON.stringify({
      width: this.width,
      height: this.height,
      tiles: this.tileIds,
      tints: this.tintIds,
    });
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

    const startIndex = this.cordsToIndex(2, height - 2);
    const keyIndex = this.cordsToIndex(6, height - 3);
    const exitIndex = this.cordsToIndex(10, height - 2);

    tiles[startIndex] = usefulTileIds.flag;
    tiles[keyIndex] = usefulTileIds.key;
    tiles[exitIndex] = usefulTileIds.chest;

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
        const tile = this.tileIds[index];
        if (tile) {
          tiles[y]![x] = tile;
        }
      }
    }
    return tiles;
  }

  dataArray() {
    const data = [];
    for (let index = 0; index < this.tileIds.length; index++) {
      const { x, y } = this.indexToCords(index);

      data.push({
        index,
        x,
        y,
        tileId: this.tileIds[index] ?? -1,
        tintId: this.tintIds[index] ?? null,
      });
    }
    return data;
  }

  findTile(tileId: number) {
    const index = this.tileIds.findIndex((tile) => tile === tileId);
    const { x, y } = this.indexToCords(index);
    return { x, y, index };
  }

  writeTiles(tiles: Phaser.Tilemaps.Tile[]) {
    tiles.forEach((tile) => {
      const index = this.cordsToIndex(tile.x, tile.y);
      this.tileIds[index] = tile.index;
      const tintId = tintData.findIndex((tint) => tint === tile.tint);
      this.tintIds[index] = tintId === -1 ? null : tintId;

      if (tile.index === usefulTileIds.flag) {
        this.startTile = { x: tile.x, y: tile.y, index };
      }
      if (tile.index === usefulTileIds.chest) {
        this.endTile = { x: tile.x, y: tile.y, index };
      }
    });
  }
}

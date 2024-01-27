import Phaser from 'phaser';

import { TILE_PNG_SIZE } from '../../constants';
import { RenderLayer, SceneKeys } from '../../keys';
import { Level } from '../../lib/level';
import { getTileData } from '../../lib/tile-data';
import { tintData } from '../../lib/tint-data';
import { BaseScene } from '../base';

enum EditingMode {
  Create,
  Tint,
  Erase,
}

export class EditingArea extends BaseScene {
  private tileMap!: Phaser.Tilemaps.Tilemap;
  private cameraControls!: Phaser.Cameras.Controls.SmoothedKeyControl;
  private level!: Level;
  private editingMode: EditingMode = EditingMode.Create;

  private selectedPaintTile: number = 24;
  private selectedTintId: number = 3;
  private marker!: Phaser.GameObjects.Graphics;

  constructor() {
    super(SceneKeys.EditorArea);
  }

  init({ level }: { level: Level }) {
    this.level = level;
  }

  create() {
    this.createTileMap();
    this.createGrid();
    this.createCameraControls();
    this.createMarker();

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.key === '1') {
        this.dimEdges(false);
        this.editingMode = EditingMode.Create;
      } else if (event.key === '2') {
        this.dimEdges(false);
        this.editingMode = EditingMode.Tint;
      } else if (event.key === '3') {
        this.dimEdges(true);
        this.editingMode = EditingMode.Erase;
      }
    });

    return this;
  }

  createMarker() {
    this.marker = this.add.graphics();
    this.marker.lineStyle(2, 0xff0000, 1);
    this.marker.strokeRect(
      0,
      0,
      this.tileMap.tileWidth,
      this.tileMap.tileHeight
    );
  }

  createGrid() {
    this.add
      .grid(
        0,
        0,
        this.tileMap.widthInPixels,
        this.tileMap.heightInPixels,
        this.tileMap.tileWidth,
        this.tileMap.tileHeight,
        undefined,
        undefined,
        0xffffff,
        0.5
      )
      .setOrigin(0, 0);
  }

  createTileMap() {
    this.tileMap = this.make.tilemap({
      data: this.level.tilesTo2DArray(),
      tileHeight: TILE_PNG_SIZE,
      tileWidth: TILE_PNG_SIZE,
      width: this.level.width,
      height: this.level.height,
    });

    const tileset = this.tileMap.addTilesetImage(
      'tiles',
      undefined,
      TILE_PNG_SIZE,
      TILE_PNG_SIZE,
      0,
      0
    );

    if (!tileset) {
      console.error('No tileset found');
      return;
    }

    this.tileMap.createLayer('layer', tileset)?.setDepth(RenderLayer.Game);
    this.level.dataArray().forEach(({ tintId, x, y, tileId }) => {
      const tile = this.tileMap.getTileAt(x, y);
      if (!tile) {
        return;
      }

      const defaultTintId = getTileData(tileId)?.defaultTintId;
      const usingTintId = tintId ?? defaultTintId ?? 0;
      const tintColour = tintData[usingTintId]!;

      tile.tint = tintColour;
    });
  }

  createCameraControls() {
    const cursors = this.input.keyboard?.createCursorKeys();

    this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl({
      camera: this.cameras.main,
      left: cursors?.left,
      right: cursors?.right,
      up: cursors?.up,
      down: cursors?.down,
      zoomIn: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      minZoom: 0.5,
      maxZoom: 2,
      acceleration: 0.1,
      drag: 0.005,
      maxSpeed: 4.0,
    });

    this.cameras.main.setBounds(
      -this.tileMap.tileWidth,
      -this.tileMap.tileHeight,
      this.tileMap.widthInPixels + this.tileMap.tileWidth * 2,
      this.tileMap.heightInPixels + this.tileMap.tileHeight * 2
    );
  }

  saveToLevel() {
    if (!this.tileMap || !this.level) {
      return;
    }

    const tiles = (
      this.tileMap.getTilesWithin(
        0,
        0,
        this.tileMap.width,
        this.tileMap.height,
        undefined,
        undefined
      ) ?? []
    ).map((tile) => tile.index);

    const tints = (
      this.tileMap.getTilesWithin(
        0,
        0,
        this.tileMap.width,
        this.tileMap.height,
        undefined,
        undefined
      ) ?? []
    ).map((tile) => tile.tint);

    this.level.tiles = tiles;
    this.level.tints = tints;
  }

  update(time: number, deltaTime: number) {
    this.cameraControls.update(deltaTime);

    const worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main
    ) as Phaser.Math.Vector2;

    // Rounds down to nearest tile
    const pointerTileX = this.tileMap.worldToTileX(worldPoint.x);
    const pointerTileY = this.tileMap.worldToTileY(worldPoint.y);
    if (pointerTileX === null || pointerTileY === null) {
      return;
    }

    this.updateMarker(time, deltaTime, pointerTileX, pointerTileY);

    if (this.input.manager.activePointer.isDown) {
      switch (this.editingMode) {
        case EditingMode.Create:
          this.createTile(pointerTileX, pointerTileY, this.selectedPaintTile);
          break;

        case EditingMode.Erase:
          this.eraseTile(pointerTileX, pointerTileY);
          break;

        case EditingMode.Tint:
          this.tintTile(pointerTileX, pointerTileY, this.selectedTintId);
          break;
      }
    }
  }

  updateMarker(
    time: number,
    deltaTime: number,
    pointerTileX: number,
    pointerTileY: number
  ) {
    this.marker.x = this.tileMap.tileToWorldX(pointerTileX) ?? 0;
    this.marker.y = this.tileMap.tileToWorldY(pointerTileY) ?? 0;

    if (
      this.marker.x < 0 ||
      this.marker.y < 0 ||
      this.marker.x > this.tileMap.widthInPixels - this.tileMap.tileWidth ||
      this.marker.y > this.tileMap.heightInPixels - this.tileMap.tileHeight
    ) {
      this.marker.setVisible(false);
    } else {
      this.marker.setVisible(true);
    }
  }

  createTile(x: number, y: number, tileId: number) {
    this.tileMap.putTileAt(tileId, x, y);
  }

  eraseTile(x: number, y: number) {
    // Check if on edge
    if (
      x === 0 ||
      y === 0 ||
      x === this.tileMap.width - 1 ||
      y === this.tileMap.height - 1
    ) {
      return;
    }

    this.tileMap.removeTileAt(x, y);
  }

  tintTile(x: number, y: number, tintId: number) {
    const tile = this.tileMap.getTileAt(x, y);
    const tintColour = tintData[tintId]!;
    if (!tile) {
      return;
    }

    tile.tint = tintColour;
  }

  dimEdges(doDim = true) {
    const tiles = this.tileMap.getTilesWithin(
      0,
      0,
      this.tileMap.width,
      this.tileMap.height,
      undefined,
      undefined
    );

    if (!tiles) {
      return;
    }

    tiles.forEach((tile) => {
      if (
        tile.x === 0 ||
        tile.y === 0 ||
        tile.x === this.tileMap.width - 1 ||
        tile.y === this.tileMap.height - 1
      ) {
        tile.alpha = doDim ? 0.5 : 1;
      }
    });
  }
}

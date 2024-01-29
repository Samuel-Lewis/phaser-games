import Phaser from 'phaser';

import { RenderLayer, Sequencer } from '@samuel-lewis/engine';

import { TILE_PNG_SIZE } from '../../constants';
import { ChamberEvents, SceneKeys } from '../../keys';
import { Level } from '../../lib/level';
import { getTileData } from '../../lib/tile-data';
import { tintData } from '../../lib/tint-data';
import { BaseScene } from '../base';

import { Player } from './player';

export class ChamberScene extends BaseScene {
  private level!: Level;
  private tileMap!: Phaser.Tilemaps.Tilemap;
  private workingLayer?: Phaser.Tilemaps.TilemapLayer;
  private testMode: boolean = false;
  private runEnabled: boolean = false;
  private player!: Player;

  private introSequencer!: Sequencer;

  constructor() {
    super(SceneKeys.Chamber);
  }

  init({
    serialisedLevel,
    testMode = false,
  }: {
    serialisedLevel: string;
    testMode: boolean;
  }) {
    this.level = new Level(serialisedLevel);
    this.testMode = testMode;
  }

  create() {
    super.create();
    this.createTileMap();
    this.createCameraControls();
    this.createUIListeners();
    this.createPlayer();
    this.createIntroSequence();

    return this;
  }

  createUIListeners() {
    this.scene
      .get(SceneKeys.ChamberUI)
      .events.on(ChamberEvents.NavigateEditor, () => {
        // TODO
        this.navigateEditor();
      });
  }

  createCameraControls() {}

  createIntroSequence() {
    this.introSequencer = new Sequencer()
      .addStep({
        duration: 1000,
        onEnter: () => {
          const tile = this.level.endTile;
          const endX = this.tileMap.tileToWorldX(tile.x) ?? 0;
          const endY = this.tileMap.tileToWorldY(tile.y) ?? 0;
          this.cameras.main.centerOn(endX, endY);
        },
      })
      .addStep({
        duration: 3000,
        onEnter: () => {
          const tile = this.level.startTile;
          const startX = this.tileMap.tileToWorldX(tile.x) ?? 0;
          const startY = this.tileMap.tileToWorldY(tile.y) ?? 0;
          this.cameras.main.pan(
            this.player.x,
            this.player.y,
            3000,
            'Cubic.easeInOut',
            true
          );
        },
      })
      .addStep({
        duration: 100,
        onEnter: () => {
          this.startRun();
        },
      })
      .start();
  }

  createPlayer() {
    const tile = this.level.startTile;
    const startX = this.tileMap.tileToWorldX(tile.x) ?? 0;
    const startY = this.tileMap.tileToWorldY(tile.y) ?? 0;

    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.player = new Player(this, startX, startY)
      .create()
      .setDepth(RenderLayer.Player);

    if (this.workingLayer) {
      this.physics.add.collider(this.player, this.workingLayer);
    }
  }

  update(time: number, deltaTime: number) {
    super.update(time, deltaTime);

    this.introSequencer.update(time, deltaTime);
    if (this.player && this.runEnabled) {
      this.player.update(time, deltaTime);
    }
  }

  startRun() {
    this.cameras.main.startFollow(this.player);
    this.runEnabled = true;
  }

  createTileMap() {
    this.tileMap = this.make.tilemap({
      data: this.level.tilesTo2DArray(),
      tileHeight: TILE_PNG_SIZE,
      tileWidth: TILE_PNG_SIZE,
      width: this.level.width,
      height: this.level.height,
      insertNull: true,
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

    this.workingLayer = this.tileMap
      .createLayer('layer', tileset)
      ?.setDepth(RenderLayer.World);

    this.level.dataArray().forEach(({ tintId, x, y, tileId }) => {
      const tile = this.tileMap.getTileAt(x, y);
      if (!tile) {
        return;
      }
      const tileData = getTileData(tileId);

      // Tint
      const usingTintId = tintId ?? tileData?.defaultTintId ?? 0;
      const tintColour = tintData[usingTintId]!;
      tile.tint = tintColour;

      // Physics
      tile.setCollision(tileData?.solid ?? false);
    });
  }

  navigateEditor() {
    this.scene.stop(SceneKeys.ChamberUI);

    this.scene.start(SceneKeys.Chamber, {
      serialisedLevel: this.level.serialise(),
    });
  }
}

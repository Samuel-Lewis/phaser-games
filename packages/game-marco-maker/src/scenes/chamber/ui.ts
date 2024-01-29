import Phaser from 'phaser';

import { ButtonElement, ButtonMedium, ButtonTile } from '@samuel-lewis/engine';

import { EditorEvents, SceneKeys } from '../../keys';
import { BaseScene } from '../base';
import { GRID_PADDING, GRID_SIZE } from '@samuel-lewis/engine/src/ui/constants';

export class ChamberUIScene extends BaseScene {
  constructor() {
    super(SceneKeys.ChamberUI);
  }

  create() {
    super.create();
    // this.createToolbar();
    // this.createNavigation();

    return this;
  }
}

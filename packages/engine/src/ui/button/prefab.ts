import { GRID_SIZE, SIZE_M, SIZE_S } from '../constants';

import { ButtonElement } from './button';

export class ButtonSmall extends ButtonElement {
  width = GRID_SIZE * SIZE_S * 3;
  height = GRID_SIZE * SIZE_S;
}

export class ButtonMedium extends ButtonElement {
  width = GRID_SIZE * SIZE_M * 3;
  height = GRID_SIZE * SIZE_M;
}

export class ButtonTile extends ButtonElement {
  width = GRID_SIZE * SIZE_M;
  height = GRID_SIZE * SIZE_M;
}

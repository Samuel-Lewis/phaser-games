export const enum TileType {
  Character = 'character',
  Tile = 'tile',
  UI = 'ui',
}

type TileData = {
  id: number;
  tileType: TileType;
  name: string;
  defaultTintId: number;
  solid: boolean;
  deadly: boolean;
  effector?: () => void;
};

const tileDefaults: TileData = {
  id: 0,
  tileType: TileType.Tile,
  name: '',
  defaultTintId: 0,
  solid: true,
  deadly: false,
};

export const tileData: TileData[] = [
  {
    name: 'handGreen',
    tileType: TileType.Character,
  },
  {
    name: 'handPurple',
    tileType: TileType.Character,
  },
  {
    name: 'handRed',
    tileType: TileType.Character,
  },
  {
    name: 'handYellow',
    tileType: TileType.Character,
  },
  {
    name: 'roundGreen',
    tileType: TileType.Character,
  },
  {
    name: 'roundPurple',
    tileType: TileType.Character,
  },
  {
    name: 'roundRed',
    tileType: TileType.Character,
  },
  {
    name: 'roundYellow',
    tileType: TileType.Character,
  },
  {
    name: 'squareGreen',
    tileType: TileType.Character,
  },
  {
    name: 'squarePurple',
    tileType: TileType.Character,
  },
  {
    name: 'squareRed',
    tileType: TileType.Character,
  },
  {
    name: 'squareYellow',
    tileType: TileType.Character,
  },
  {
    name: 'arch',
    tileType: TileType.Tile,
  },
  {
    name: 'archColumn',
    tileType: TileType.Tile,
  },
  {
    name: 'archColumns',
    tileType: TileType.Tile,
  },
  {
    name: 'archHalf',
    tileType: TileType.Tile,
  },
  {
    name: 'arrowDown',
    tileType: TileType.Tile,
  },
  {
    name: 'arrowLeft',
    tileType: TileType.Tile,
  },
  {
    name: 'arrowRight',
    tileType: TileType.Tile,
  },
  {
    name: 'arrowUp',
    tileType: TileType.Tile,
  },
  {
    name: 'belt',
    tileType: TileType.Tile,
  },
  {
    name: 'block',
    tileType: TileType.Tile,
  },
  {
    name: 'blockDoor',
    tileType: TileType.Tile,
  },
  {
    name: 'blockWindow',
    tileType: TileType.Tile,
  },
  {
    name: 'border',
    tileType: TileType.Tile,
  },
  {
    name: 'brick',
    tileType: TileType.Tile,
  },
  {
    name: 'bridge',
    tileType: TileType.Tile,
  },
  {
    name: 'bush',
    tileType: TileType.Tile,
  },
  {
    name: 'bushHalf',
    tileType: TileType.Tile,
  },
  {
    name: 'castle',
    tileType: TileType.Tile,
  },
  {
    name: 'chest',
    tileType: TileType.Tile,
  },
  {
    name: 'cog',
    tileType: TileType.Tile,
  },
  {
    name: 'coin',
    tileType: TileType.Tile,
  },
  {
    name: 'column',
    tileType: TileType.Tile,
  },
  {
    name: 'crate',
    tileType: TileType.Tile,
  },
  {
    name: 'crateDiagonal',
    tileType: TileType.Tile,
  },
  {
    name: 'crateSmall',
    tileType: TileType.Tile,
  },
  {
    name: 'diagonal',
    tileType: TileType.Tile,
  },
  {
    name: 'door',
    tileType: TileType.Tile,
  },
  {
    name: 'fence',
    tileType: TileType.Tile,
  },
  {
    name: 'fenceHigh',
    tileType: TileType.Tile,
  },
  {
    name: 'flag',
    tileType: TileType.Tile,
  },
  {
    name: 'gem',
    tileType: TileType.Tile,
  },
  {
    name: 'grab',
    tileType: TileType.Tile,
  },
  {
    name: 'grass',
    tileType: TileType.Tile,
  },
  {
    name: 'heart',
    tileType: TileType.Tile,
  },
  {
    name: 'item',
    tileType: TileType.Tile,
  },
  {
    name: 'key',
    tileType: TileType.Tile,
  },
  {
    name: 'ladder',
    tileType: TileType.Tile,
  },
  {
    name: 'roof',
    tileType: TileType.Tile,
  },
  {
    name: 'sand',
    tileType: TileType.Tile,
  },
  {
    name: 'slope',
    tileType: TileType.Tile,
  },
  {
    name: 'spike',
    tileType: TileType.Tile,
  },
  {
    name: 'spikes',
    tileType: TileType.Tile,
  },
  {
    name: 'stone',
    tileType: TileType.Tile,
  },
  {
    name: 'tile',
    tileType: TileType.Tile,
  },
  {
    name: 'top',
    tileType: TileType.Tile,
  },
  {
    name: 'tree',
    tileType: TileType.Tile,
  },
  {
    name: 'treeTop',
    tileType: TileType.Tile,
  },
  {
    name: 'treeTrunk',
    tileType: TileType.Tile,
  },
  {
    name: 'water',
    tileType: TileType.Tile,
  },
  {
    name: 'balloon',
    tileType: TileType.UI,
  },
  {
    name: 'box',
    tileType: TileType.UI,
  },
  {
    name: 'button',
    tileType: TileType.UI,
  },
  {
    name: 'circle',
    tileType: TileType.UI,
  },
  {
    name: 'hand',
    tileType: TileType.UI,
  },
  {
    name: 'num0',
    tileType: TileType.UI,
  },
  {
    name: 'num1',
    tileType: TileType.UI,
  },
  {
    name: 'num2',
    tileType: TileType.UI,
  },
  {
    name: 'num3',
    tileType: TileType.UI,
  },
  {
    name: 'num4',
    tileType: TileType.UI,
  },
  {
    name: 'num5',
    tileType: TileType.UI,
  },
  {
    name: 'num6',
    tileType: TileType.UI,
  },
  {
    name: 'num7',
    tileType: TileType.UI,
  },
  {
    name: 'num8',
    tileType: TileType.UI,
  },
  {
    name: 'num9',
    tileType: TileType.UI,
  },
  {
    name: 'numPercent',
    tileType: TileType.UI,
  },
  {
    name: 'numPeriod',
    tileType: TileType.UI,
  },
  {
    name: 'numX',
    tileType: TileType.UI,
  },
  {
    name: 'numXlarge',
    tileType: TileType.UI,
  },
  {
    name: 'select',
    tileType: TileType.UI,
  },
].map((tile, index) => ({
  ...tileDefaults,
  ...tile,
  id: index,
}));

export const getTileData = (tileId: number) => {
  if (tileId === -1) {
    return undefined;
  }

  const tile = tileData[tileId];
  if (!tile) {
    throw new Error(`Tile ${tileId} not found`);
  }

  return tile;
};

export const findTileId = (name: string) => {
  const tile = tileData.find((tile) => tile.name === name);
  if (!tile) {
    throw new Error(`Tile ${name} not found`);
  }

  return tile.id;
};

export const editorTiles = tileData.filter(
  (tile) => tile.tileType === TileType.Tile
);

export const usefulTileIds = {
  diagonal: findTileId('diagonal'),
  select: findTileId('select'),
  flag: findTileId('flag'),
};

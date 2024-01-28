import Phaser from 'phaser';

const createFontStyle = (config: Phaser.Types.GameObjects.Text.TextStyle) => {
  return {
    fontFamily: 'future',
    fontSize: '16px',
    fontStyle: 'normal',
    align: 'center',
    ...config,
  };
};

export const fontPresets: Record<
  string,
  Phaser.Types.GameObjects.Text.TextStyle
> = {
  heading: createFontStyle({
    fontSize: '48px',
    fontStyle: 'bold',
  }),

  subheading: createFontStyle({
    fontSize: '32px',
    fontStyle: 'bold',
  }),

  body: createFontStyle({
    fontSize: '24px',
  }),
};

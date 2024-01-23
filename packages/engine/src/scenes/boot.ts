import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  private loadProgress = 0;
  private nextSceneKey: string;
  private labelLoad?: Phaser.GameObjects.Text;

  constructor(bootSceneKey: string = 'boot', nextSceneKey: string = 'start') {
    super(bootSceneKey);
    this.nextSceneKey = nextSceneKey;
  }

  preload() {
    const origin = window.location.origin;
    this.load.setBaseURL(origin);

    this.load.on('progress', (progress: number) => {
      this.loadProgress = progress;
    });

    this.load.on('complete', () => {
      this.onComplete();
    });
  }

  onComplete() {
    this.scene.start(this.nextSceneKey);
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.labelLoad = this.add.text(centerX, centerY, '', {
      color: '#ffffff',
      fontFamily: 'future, Verdana, sans-serif',
    });
  }

  update() {
    const loadPercent = Math.round(this.loadProgress * 100);
    this.labelLoad?.setText(`Loading ${loadPercent}%`);
  }
}

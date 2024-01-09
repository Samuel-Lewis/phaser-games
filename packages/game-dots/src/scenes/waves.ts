import Phaser from 'phaser';
import Noise from 'ts-perlin-simplex';

const numCircles = 100;
const circleSize = 4;
const color = 0x6666ff;

export class Waves extends Phaser.Scene {
  private simplex = new Noise.SimplexNoise();
  private fpsLabel!: Phaser.GameObjects.Text;
  private circles: Array<Phaser.GameObjects.Arc> = [];
  private containers: Array<Phaser.GameObjects.Container> = [];
  private emitters: Array<Phaser.GameObjects.Particles.ParticleEmitter> = [];

  constructor() {
    super('waves');
  }

  preload() {
    this.load.setBaseURL('https://labs.phaser.io');

    this.load.image('brush', 'assets/sprites/brush2.png');
  }

  private getNoise(xSeed: number, ySeed: number, zSeed: number = 0) {
    const noiseX = (this.simplex.noise(xSeed / 500, zSeed) + 1) / 2;
    const noiseY = (this.simplex.noise(zSeed, ySeed / 500) - 1) / 2;
    return { noiseX, noiseY };
  }

  private noiseToVector(xNoise: number, yNoise: number) {
    const angle = Math.atan2(yNoise, xNoise);
    const xDelta = Math.cos(angle);
    const yDelta = Math.sin(angle);
    return { xDelta, yDelta };
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    for (let i = 0; i < numCircles; i++) {
      const randomX = Math.random() * width;
      const randomY = Math.random() * height;
      // const container = this.add.container(randomX, randomY);

      // const circle = this.add.circle(0, 0, circleSize, color);
      const emitter = this.add.particles(0, 0, 'brush', {
        lifespan: 3000,
        scale: { start: 0.1, end: 0 },
        tint: color,
      });
      emitter.particleX = randomX;
      emitter.particleY = randomY;
      this.emitters.push(emitter);
    }

    // FPS label
    this.fpsLabel = this.add.text(10, 10, '');
  }

  update(time: number, delta: number): void {
    const { width, height } = this.sys.game.canvas;

    // FPS counter
    const fps = Math.floor(1000 / delta);
    this.fpsLabel.setText(`FPS: ${fps}`);

    for (let i = 0; i < numCircles; i++) {
      const emitter = this.emitters[i];
      if (!emitter) {
        continue;
      }

      const { noiseX, noiseY } = this.getNoise(
        Number(emitter.particleX),
        Number(emitter.particleY),
        time / 10000
      );
      const { xDelta, yDelta } = this.noiseToVector(noiseX, noiseY);

      emitter.particleX = Number(emitter.particleX) + xDelta;
      emitter.particleY = Number(emitter.particleY) + yDelta;

      // Add particle

      if (emitter.particleX < 0 - circleSize) {
        emitter.particleX = width + circleSize;
      } else if (emitter.particleX > width + circleSize) {
        emitter.particleX = 0 - circleSize;
      }

      if (emitter.particleY < 0 - circleSize) {
        emitter.particleY = height + circleSize;
      } else if (emitter.particleY > height + circleSize) {
        emitter.particleY = 0 - circleSize;
      }
    }
  }
}

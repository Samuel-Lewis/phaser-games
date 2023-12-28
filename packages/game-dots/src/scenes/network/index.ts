import Phaser from "phaser";
import Noise from "ts-perlin-simplex";

const numCircles = 100;
const circleSize = 4;
const moveSpeed = 5;
const color = 0x6666ff;

export class Network extends Phaser.Scene {
  private simplex = new Noise.SimplexNoise();
  private fpsLabel!: Phaser.GameObjects.Text;

  private circles: Array<Phaser.GameObjects.Arc> = [];
  private lines: Array<{
    line: Phaser.GameObjects.Line;
    circle1: Phaser.GameObjects.Arc;
    circle2: Phaser.GameObjects.Arc;
  }> = [];

  create() {
    const { width, height } = this.sys.game.canvas;

    for (let i = 0; i < numCircles; i++) {
      const randomX = Math.random() * width;
      const randomY = Math.random() * height;
      const circle = this.add.circle(randomX, randomY, circleSize, color);
      this.circles.push(circle);
    }

    for (let i = 0; i < numCircles; i++) {
      for (let j = i + 1; j < numCircles; j++) {
        const circle1 = this.circles[i];
        const circle2 = this.circles[j];
        const line = this.add
          .line(0, 0, circle1.x, circle1.y, circle2.x, circle2.y, color)
          .setOrigin(0, 0)
          .setLineWidth(2);

        this.lines.push({
          line,
          circle1,
          circle2,
        });
      }
    }

    // FPS label
    this.fpsLabel = this.add.text(10, 10, "");
  }

  update(time: number, delta: number): void {
    const { width, height } = this.sys.game.canvas;

    // FPS counter
    const fps = Math.floor(1000 / delta);
    this.fpsLabel.setText(`FPS: ${fps}`);

    // Circle movement
    for (let i = 0; i < numCircles; i++) {
      const circle = this.circles[i];
      const noiseOffset = i * 1000;
      const noiseX =
        (this.simplex.noise(time / 5000, noiseOffset) * moveSpeed * delta) /
        100;
      const noiseY =
        (this.simplex.noise(-noiseOffset, time / 5000) * moveSpeed * delta) /
        100;

      circle.x += noiseX;
      circle.y += noiseY;

      if (circle.x < 0 - circleSize) {
        circle.x = width + circleSize;
      } else if (circle.x > width + circleSize) {
        circle.x = 0 - circleSize;
      }

      if (circle.y < 0 - circleSize) {
        circle.y = height + circleSize;
      } else if (circle.y > height + circleSize) {
        circle.y = 0 - circleSize;
      }
    }

    // Line rendering
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const { x: c1x = Number.MAX_VALUE, y: c1y = Number.MAX_VALUE } =
        line.circle1.getCenter();
      const { x: c2x = Number.MAX_VALUE, y: c2y = Number.MAX_VALUE } =
        line.circle2.getCenter();

      line.line.setTo(c1x, c1y, c2x, c2y);

      const distance = Phaser.Math.Distance.Between(c1x, c1y, c2x, c2y);

      const alpha = Phaser.Math.Clamp(1 - distance / 250, 0, 1);
      line.line.setAlpha(alpha);
    }
  }
}

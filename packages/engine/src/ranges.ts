import Phaser from 'phaser';

export const evenInSegment = (
  start: number,
  end: number,
  segments: number
): number[] => {
  const segmentLength = (end - start) / segments;
  const result = [];
  for (let i = 0; i < segments; i++) {
    const centerX = start + segmentLength * i + segmentLength / 2;
    result.push(centerX);
  }
  return result;
};

export const randomInSegments = (
  start: number,
  end: number,
  segments: number
): number[] => {
  const segmentLength = (end - start) / segments;
  const result = [];
  for (let i = 0; i < segments; i++) {
    const randomX = Phaser.Math.Between(
      start + segmentLength * i,
      start + segmentLength * (i + 1)
    );
    result.push(randomX);
  }
  return result;
};

export type Step = {
  duration: number;
  onEnter?: () => void;
  onUpdate?: () => void;
  onExit?: () => void;
};

export class Sequencer {
  private steps: Step[] = [];

  private currentStep = 0;
  private currentStepTime = 0;
  private playing = false;

  constructor() {
    return this;
  }

  add(step: Step) {
    this.steps.push(step);
    return this;
  }

  start() {
    this.playing = true;
    return this;
  }

  stop() {
    this.playing = false;
    return this;
  }

  reset() {
    this.currentStep = 0;
    this.currentStepTime = 0;
    return this;
  }

  update = (time: number, delta: number) => {
    if (!this.playing) {
      return;
    }

    this.currentStepTime += delta;

    if (this.currentStep >= this.steps.length) {
      return;
    }

    const step = this.steps[this.currentStep];
    if (!step) {
      return;
    }

    if (this.currentStepTime >= step.duration) {
      if (step.onExit) {
        step.onExit();
      }

      this.currentStepTime = 0;
      this.currentStep++;

      if (this.currentStep >= this.steps.length) {
        return;
      }

      const nextStep = this.steps[this.currentStep];
      if (!nextStep) {
        return;
      }

      if (nextStep.onEnter) {
        nextStep.onEnter();
      }
    } else {
      if (step.onUpdate) {
        step.onUpdate();
      }
    }
    return this;
  };
}

export enum StepType {
  STEP,
  PAUSE,
}

export type Step = {
  type: StepType;
  duration: number;
  onEnter?: () => void;
  onUpdate?: (resume: () => void) => void;
  onExit?: () => void;
};

export class Sequencer {
  private steps: Step[] = [];

  private currentStep = 0;
  private currentStepTime = 0;
  private playing = false;

  constructor(steps: Step[] = []) {
    this.steps = steps;
    return this;
  }

  getSteps() {
    return this.steps;
  }

  addStep(step: Omit<Step, 'type'>) {
    return this.add({ ...step, type: StepType.STEP });
  }

  addPause(step: Omit<Step, 'type' | 'duration'>) {
    return this.add({ ...step, duration: 2, type: StepType.PAUSE });
  }

  add(step: Step) {
    this.steps.push(step);
    return this;
  }

  unshift(step: Step) {
    this.steps.unshift(step);
    return this;
  }

  start() {
    this.playing = true;
    return this;
  }

  unpause() {
    this.currentStepTime = 10;
    return this.start();
  }

  stop() {
    return this.reset();
  }

  reset() {
    this.playing = false;
    this.currentStep = 0;
    this.currentStepTime = 0;
    return this;
  }

  update = (time: number, delta: number) => {
    const step = this.steps[this.currentStep];
    if (!this.playing || !step) {
      return;
    }

    if (this.currentStepTime === 0 && step.onEnter) {
      step.onEnter();
    }

    if (step.type === StepType.PAUSE) {
      this.currentStepTime = 1;
    } else {
      this.currentStepTime += delta;
    }

    if (step.onUpdate) {
      step.onUpdate(() => this.unpause());
    }

    if (this.currentStepTime >= step.duration) {
      if (step.onExit) {
        step.onExit();
      }

      this.currentStepTime = 0;
      this.currentStep++;
    }

    return this;
  };
}

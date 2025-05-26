export class Dice {
  readonly values: number[];
  constructor(values: number[]) {
    this.values = values;
  }

  get size(): number {
    return this.values.length;
  }
}

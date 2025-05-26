import { Dice } from "./dice";

export class ProbabilityCalculator {
  static calculate(dice1: Dice, dice2: Dice) {
    let awins = 0;
    let bwins = 0;
    let draws = 0;
    const total = dice1.size * dice2.size;
    for (const die1 of dice1.values) {
      dice2.values.forEach((die2) => {
        if (die1 > die2) {
          awins++;
        } else if (die1 < die2) {
          bwins++;
        } else {
          draws++;
        }
      });
    }
    return {
      a: +((awins / total) * 100).toFixed(2),
      b: +((bwins / total) * 100).toFixed(2),
      draws: +((draws / total) * 100).toFixed(2),
    };
  }
}

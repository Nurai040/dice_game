import { Dice } from "./dice";
import { ProbabilityCalculator } from "./probability_calculator";

export class ProbabilityTable {
  static buildTable(dice: Dice[]) {
    const size = dice.length;
    const header = ["     ", ...dice.map((die, i) => `D${i + 1}`)].join(" | ");
    const separator = "-".repeat(header.length + size * 3);
    console.log(header);
    console.log(separator);

    for (let i = 0; i < size; i++) {
      const row = [`D${i + 1}`];
      for (let j = 0; j < size; j++) {
        if (i === j) {
          row.push("   - ");
        } else {
          const { a } = ProbabilityCalculator.calculate(dice[i], dice[j]);
          row.push(`${a}%`);
        }
      }
      console.log(row.join(" | "));
    }
  }
}

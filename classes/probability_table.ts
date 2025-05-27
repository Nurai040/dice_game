import { Dice } from "./dice";
import { ProbabilityCalculator } from "./probability_calculator";
import Table from "cli-table3";

export class ProbabilityTable {
  static buildTable(dice: Dice[]) {
    const size = dice.length;

    const table = new Table({
      head: [""].concat(dice.map((_, i) => `D${i + 1}`)),
      colWidths: new Array(size + 1).fill(12),
      wordWrap: true,
    });

    for (let i = 0; i < size; i++) {
      const row = [`D${i + 1}`];
      for (let j = 0; j < size; j++) {
        if (i === j) {
          row.push("-");
        } else {
          const { a } = ProbabilityCalculator.calculate(dice[i], dice[j]);
          row.push(`${a}%`);
        }
      }
      table.push(row);
    }

    console.log("Probability of the win for the user:");
    console.log(table.toString());
  }
}

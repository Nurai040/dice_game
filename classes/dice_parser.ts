import { Dice } from "./dice";

export class DiceParser {
  static parser(args: string[]): Dice[] {
    if (args.length < 3) {
      throw new Error(
        `Number of dices must be more than 2. Example: node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3`
      );
    }
    const diceList: Dice[] = [];

    args.forEach((arg, index) => {
      const values = arg.split(",").map((a) => {
        const n = Number(a.trim());
        if (Number.isNaN(n)) {
          throw new Error(
            `Die ${index} has incorrect value - ${a}, it should be integer`
          );
        }
        return n;
      });
      if (values.length < 2) {
        throw new Error(`Die ${index} must have at least 2 faces`);
      }
      if (values.length % 2) {
        throw new Error(`Die ${index} must be two sided`);
      }
      diceList.push(new Dice(values));
    });

    return diceList;
  }
}

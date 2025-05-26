import { DiceParser } from "./classes/dice_parser";

try {
  const dice = DiceParser.parser(process.argv.slice(2));
  dice.forEach((d, i) => console.log(`Dice ${i + 1} has values: ${d.values}`));
} catch (error) {
  throw new Error(`Error occured during launch: ${error}`);
}

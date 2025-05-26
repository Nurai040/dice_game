import { DiceParser } from "./classes/dice_parser";
import { FairRandom } from "./classes/fair_random";

try {
  const dice = DiceParser.parser(process.argv.slice(2));
  dice.forEach((d, i) => console.log(`Dice ${i + 1} has values: ${d.values}`));

  const fair = new FairRandom(2);
  console.log("HMAC: ", fair.showHmac());

  const userInput = 1;
  const reaveled = fair.reveal(userInput);
  console.log("Revealed:  ", reaveled);
} catch (error) {
  throw new Error(`Error occured during launch: ${error}`);
}

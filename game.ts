import { Cli } from "./classes/cli";
import { DiceParser } from "./classes/dice_parser";
import { FairRandom } from "./classes/fair_random";
import { ProbabilityTable } from "./classes/probability_table";

try {
  const dice = DiceParser.parser(process.argv.slice(2));
  const game = new Cli(dice);
  game.run();
} catch (error) {
  throw new Error(`Error occured during launch: ${error}`);
}

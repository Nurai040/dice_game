import { Cli } from "./classes/cli";
import { DiceParser } from "./classes/dice_parser";

const dice = DiceParser.parser(process.argv.slice(2));
const game = new Cli(dice);
game.run();

import { Cli } from "./classes/cli";
import { DiceParser } from "./classes/dice_parser";

const dice = DiceParser.parser(process.argv.slice(2));
const game = new Cli(dice);
game.run();

//4 identical dice 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6
// 3 dice 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7
// launch with incorrect parameters (no dice; 2 dice; invalid number of sides; non-integer value in the dice configuration)
// help table with probabilities (on 3 dice from the example)
// whole game played with the output of results (at least 2 runs);

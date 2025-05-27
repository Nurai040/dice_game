import { createInterface } from "readline";
import { Dice } from "./dice";
import { ProbabilityTable } from "./probability_table";
import { FairRandom } from "./fair_random";
import { randomInt } from "crypto";

function askQuestion(query: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}
export class Cli {
  private dice: Dice[];
  private first = new FairRandom(2);
  constructor(dice: Dice[]) {
    this.dice = dice;
  }

  public showHelp() {
    console.log("The win probability table: ");
    ProbabilityTable.buildTable(this.dice);
  }

  async run() {
    console.log(`Let's determine who makes the first move.`);
    console.log(`I selected a random value in the range 0..1 `);
    console.log(`(HMAC:  ${this.first.showHmac()})`);

    let input: string = "";
    while (!["0", "1"].includes(input)) {
      console.log(`Try to guess my selection.`);
      console.log("0 - 0");
      console.log("1 - 1");
      console.log("X - exit");
      console.log("? - help");
      input = (await askQuestion("Your selection: ")).toLowerCase();

      if (input === "x") {
        return console.log("Exiting...");
      }
      if (input === "?") {
        this.showHelp();
        continue;
      }
    }

    const userGuess = Number(input);
    const { computerNumber, keyHex, result } = this.first.reveal(userGuess);
    console.log("My selection:", computerNumber);
    console.log(`(Key: ${keyHex})`);

    const userFirst = result === userGuess;

    if (!userFirst) {
      await this.computerFirstMove();
    } else {
      await this.userFirstMove();
    }
  }

  async rollFairRandom(dice: Dice) {
    const fair = new FairRandom(dice.size);
    console.log(`I selected a random value in the range 0..${dice.size - 1}`);
    console.log(`(HMAC: ${fair.showHmac()})`);
    console.log(`Add your number modulo ${dice.size}:`);

    for (let i = 0; i < dice.size; i++) {
      console.log(`${i} - ${i}`);
    }
    console.log("X - exit");
    console.log("? - help");
    while (true) {
      const input = (await askQuestion("Your selection: ")).toLowerCase();

      if (input === "x") return console.log("Exiting...");
      if (input === "?") {
        this.showHelp();
        continue;
      }
      const userNum = Number(input);
      if (!isNaN(userNum) && userNum >= 0 && userNum < dice.size) {
        const { computerNumber, keyHex, result } = fair.reveal(userNum);
        console.log(`My number is ${computerNumber} (KEY=${keyHex})`);
        console.log(
          `The fair number generation result is ${computerNumber} + ${userNum} = ${result} (mod ${dice.size}).`
        );
        return dice.values[result];
      }

      console.log("Invalid input. Try again.");
    }
  }

  async userFirstMove() {
    console.log(`You make the first move. Choose your dice: `);
    for (let i = 0; i < this.dice.length; i++) {
      console.log(`${i}: ${this.dice.values}`);
    }
    while (true) {
      const input = (await askQuestion("Your selection: ")).toLowerCase();
      if (input === "x") {
        return console.log("Exiting...");
      }
      if (input === "?") {
        this.showHelp();
        continue;
      }
      const index = Number(input);
      if (!isNaN(index) && index >= 0 && index < this.dice.length) {
        const userDice = this.dice[index];
        console.log(`You chose the ${userDice.values} dice.`);
        const compDiceIndex = randomInt(0, this.dice.length - 1);
        const leftDice = this.availableDice(index);
        console.log(`I  choose the ${leftDice[compDiceIndex]} dice`);

        console.log(`It's time for your roll`);
        const userRollResult = await this.rollFairRandom(userDice);
        console.log(`Your roll result is ${userRollResult}`);
        console.log(`It's time for my roll`);
        const computerRollResult = await this.rollFairRandom(
          leftDice[compDiceIndex]
        );
        console.log(`My roll result is ${computerRollResult}`);
        if (userRollResult > computerRollResult) {
          console.log(`You win ${userRollResult}>${computerRollResult}`);
        } else if (userRollResult < computerRollResult) {
          console.log(`You lose ${userRollResult}<${computerRollResult}`);
        } else {
          console.log(`it's a draw! ${userRollResult}=${computerRollResult}`);
        }

        return;
      }
      console.log("Invalid input. Please try again.");
    }
  }

  async computerFirstMove() {
    const compDiceIndex = randomInt(0, this.dice.length);
    console.log(
      `I will make the first move and choose the ${this.dice[compDiceIndex].values} dice`
    );
    console.log(`Choose your dice: `);

    const leftDice = this.availableDice(compDiceIndex);
    for (let i = 0; i < this.dice.length - 1; i++) {
      console.log(`${i}: ${leftDice[i].values}`);
    }
    while (true) {
      const input = (await askQuestion("Your selection: ")).toLowerCase();
      if (input === "x") {
        return console.log("Exiting...");
      }
      if (input === "?") {
        this.showHelp();
        continue;
      }
      const index = Number(input);
      if (!isNaN(index) && index >= 0 && index < leftDice.length) {
        const userDice = leftDice[index];
        console.log(`You chose the ${userDice} dice.`);

        console.log(`It's time for my roll`);
        const computerRollResult = await this.rollFairRandom(
          this.dice[compDiceIndex]
        );
        console.log(`My roll result is ${computerRollResult}`);
        console.log(`It's time for your roll`);
        const userRollResult = await this.rollFairRandom(userDice);
        console.log(`Your roll result is ${userRollResult}`);
        if (userRollResult > computerRollResult) {
          console.log(`You win ${userRollResult}>${computerRollResult}`);
        } else if (userRollResult < computerRollResult) {
          console.log(`You lose ${userRollResult}<${computerRollResult}`);
        } else {
          console.log(`it's a draw! ${userRollResult}=${computerRollResult}`);
        }
        return;
      }
      console.log("Invalid input. Please try again.");
    }
  }

  private availableDice(omit: number): Dice[] {
    return this.dice.filter((die) => this.dice[omit] !== die);
  }
}

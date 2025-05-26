import { createHmac, randomBytes, randomInt } from "crypto";

export class FairRandom {
  private key: Buffer;
  private number: number;
  private range: number;

  constructor(range: number) {
    if (range <= 1) throw new Error("Range must be at least 2");
    this.range = range;
    this.key = randomBytes(32);
    this.number = randomInt(0, range);
  }

  public showHmac() {
    const message = this.number.toString();
    const hmac = this.calculateHmac(message, this.key);
    return hmac;
  }

  private calculateHmac(message: string, key: Buffer) {
    const keyHex = key.toString("hex");
    return createHmac("sha3-256", key).update(message).digest("hex");
  }

  public reveal(userNumber: number): {
    computerNumber: number;
    keyHex: string;
    result: number;
  } {
    if (userNumber < 0 || userNumber >= this.range) {
      throw new Error(`Your number should be at range from 0 to ${this.range}`);
    }
    const result = (userNumber + this.number) % this.range;
    return {
      computerNumber: this.number,
      keyHex: this.key.toString("hex"),
      result,
    };
  }
}

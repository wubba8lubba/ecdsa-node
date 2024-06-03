import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

class TransactionUtil {
  static async signTransaction(privateKey, transaction) {
    const transactionHash = this.#hashTransaction(transaction);
    const signature = secp256k1.sign(transactionHash, privateKey);
    return {
      r: signature.r.toString(),
      s: signature.s.toString(),
      recovery: signature.recovery,
    };
  }

  static #hashTransaction(transaction) {
    const transactionString = JSON.stringify(transaction);
    const transactionHash = keccak256(utf8ToBytes(transactionString));
    return transactionHash;
  }
}

export default TransactionUtil;

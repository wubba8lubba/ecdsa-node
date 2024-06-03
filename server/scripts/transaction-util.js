const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, bytesToHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

class TransactionUtil {
  static async verifyTransaction(transaction, signature) {
    const publicKey = this.#recoverPublicKey(transaction, signature);
    return publicKey === transaction.sender;
  }

  static #recoverPublicKey(transaction, signature) {
    const transactionHash = this.#hashTransaction(transaction);
    const sig = new secp256k1.Signature(
      BigInt(signature.r),
      BigInt(signature.s),
      signature.recovery
    );
    const publicKey = sig.recoverPublicKey(transactionHash);
    return bytesToHex(publicKey.toRawBytes());
  }

  static #hashTransaction(transaction) {
    const transactionString = JSON.stringify(transaction, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    const transactionHash = keccak256(utf8ToBytes(transactionString));
    return transactionHash;
  }
}

module.exports = TransactionUtil;

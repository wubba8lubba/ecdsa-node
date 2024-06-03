import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

class KeyUtil {
  static getPublicKey(privateKey) {
    const publicKey = toHex(secp256k1.getPublicKey(privateKey));
    return publicKey;
  }
}

export default KeyUtil;

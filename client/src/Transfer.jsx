import { useState } from "react";
import server from "./server";
import TransactionUtil from "./transaction-util.js";
import KeyUtil from "./key-util.js";

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    try {
      const address = KeyUtil.getPublicKey(privateKey);
      const transaction = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      };

      const signature = await TransactionUtil.signTransaction(
        privateKey,
        transaction
      );

      const {
        data: { balance },
      } = await server.post(`send`, {
        transaction,
        signature,
      });

      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response?.data?.message || ex.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

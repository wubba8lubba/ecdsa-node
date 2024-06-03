const express = require("express");
const TransactionUtil = require("./scripts/transaction-util.js");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "028bf63f8b012875c3a7a7be4654627f0497251101d9cdff10bf8913955e81d3fb": 100,
  "03f31bc1756f912d556bd316e516dba07f4d11342e086d3a7a9cf510016d761337": 100,
  "037e8a48d3cc7e25686d6927631e366fbaae5c54905224c8589afc2c8d2a419de3": 100,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  console.log(req.body);
  const { signature, transaction } = req.body;
  const { sender, recipient, amount } = transaction;
  const isTransactionValid = TransactionUtil.verifyTransaction(
    transaction,
    signature
  );
  if (isTransactionValid) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res
      .status(401)
      .send({ message: "You are not authorized to do this transaction!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

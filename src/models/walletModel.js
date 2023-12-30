const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  balance: { type: Number, required: true, min: 0 },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;

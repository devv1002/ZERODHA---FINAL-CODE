const mongoose = require("mongoose");

const FundsSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  balance: {
    type: Number,
    default: 100000,
  },

  usedMargin: {
    type: Number,
    default: 0,
  },

  openingBalance: {
    type: Number,
    default: 100000,
  },

  payin: {
    type: Number,
    default: 0,
  },

  payout: {
    type: Number,
    default: 0,
  },

});

module.exports = { FundsSchema };
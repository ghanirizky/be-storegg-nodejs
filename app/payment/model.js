const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "tipe pembayaran harus di isi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    banks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);

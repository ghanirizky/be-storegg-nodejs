const mongoose = require("mongoose");

const bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama pemilik harus di isi"],
    },
    bankName: {
      type: String,
      required: [true, "Nama bank harus di isi"],
    },
    noRekening: {
      type: String,
      required: [true, "Nomor rekening bank harus di isi"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bank", bankSchema);

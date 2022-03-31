const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: {
        type: String,
        required: [true, "nama game harus di isi"],
      },
      category: {
        type: String,
        required: [true, "kategori harus di isi"],
      },
      thumbnail: {
        type: String,
      },
      coinName: {
        type: String,
        required: [true, "nama koin harus di isi"],
      },
      coinQuantity: {
        type: String,
        required: [true, "jumlah koin harus di isi"],
      },
      price: {
        type: Number,
      },
    },

    historyPayment: {
      name: {
        type: String,
        required: [true, "nama harus di isi"],
      },
      type: {
        type: String,
        required: [true, "tipe pembayaran harus di isi"],
      },
      bankName: {
        type: String,
        required: [true, "nama bank harus di isi"],
      },
      noRekening: {
        type: String,
        required: [true, "no rekening harus di isi"],
      },
    },

    name: {
      type: String,
      required: [true, "nama harus di isi"],
      maxlength: [225, "panjang nama harus antara 3 - 225 karakter"],
      minlength: [3, "panjang nama harus antara 3 - 225 karakter"],
    },

    accountUser: {
      type: String,
      required: [true, "nama akun di isi"],
      maxlength: [225, "panjang nama harus antara 3 - 225 karakter"],
      minlength: [3, "panjang nama harus antara 3 - 225 karakter"],
    },

    tax: {
      type: Number,
      default: 0,
    },

    value: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },

    historyUser: {
      name: {
        type: String,
        required: [true, "nama harus di isi"],
      },
      phoneNumber: {
        type: Number,
        required: [true, "nama akun di isi"],
        maxlength: [13, "panjang nama harus antara 9 - 13 karakter"],
        minlength: [9, "panjang nama harus antara 9 - 13 karakter"],
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);

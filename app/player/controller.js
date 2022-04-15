const Player = require("./model");
const Category = require("../category/model");
const Voucher = require("../voucher/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Bank = require("../bank/model");
const Transaction = require("../transaction/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findById(id)
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      const payment = await Payment.find().populate("banks");

      if (!voucher)
        return res
          .status(404)
          .json({ data: "Voucher game tidak di temukan !" });

      if (!payment)
        return res
          .status(404)
          .json({ data: "Metode pembayaran tidak di temukan !" });

      res.status(200).json({
        data: {
          voucher,
          payment,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan pada server" });
    }
  },

  category: async (req, res) => {
    try {
      const category = await Category.find();

      if (!category)
        return res.status(404).json({ data: "Category tidak di temukan !" });

      res.status(200).json({ data: category });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan pada server" });
    }
  },

  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;
      const res_voucher = await Voucher.findById(voucher)
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");

      if (!res_voucher)
        return res
          .status(404)
          .json({ message: "voucher game tidak di temukan" });

      const res_nominal = await Nominal.findById(nominal);

      if (!res_nominal)
        return res.status(404).json({ message: "nominal tidak di temukan" });

      const res_payment = await Payment.findById(payment).populate("banks");

      if (!res_payment)
        return res.status(404).json({ message: "payment tidak di temukan" });

      const res_bank = await Bank.findById(bank);

      if (!res_bank)
        return res.status(404).json({ message: "bank tidak di temukan" });

      const tax = 0.1 * res_nominal.price; //10%
      const value = res_nominal.price - tax;

      res_voucher.name;
      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher.name,
          category: res_voucher.category?.name,
          thumbnail: res_voucher.thumbnail,
          coinName: res_nominal.coinName,
          coinQuantity: res_nominal.coinQuantity,
          price: res_nominal.price,
        },
        historyPayment: {
          name: res_bank.name,
          type: res_payment.type,
          bankName: res_bank.bankName,
          noRekening: res_bank.noRekening,
        },

        name: name,
        accountUser: accountUser,
        tax: tax,
        value: value,
        player: req.player._id,
        historyUser: {
          name: res_voucher.user?.name,
          phoneNumber: res_voucher.user?.phoneNumber,
        },
        category: res_voucher.category?._id,
        user: res_voucher.user?._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();

      res.status(201).json({
        message: "Success",
        data: payload,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  },

  transactionHistory: async (req, res) => {
    try {
      const { status = "" } = req.query;

      let criteria = {};

      if (status.length)
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };

      if (req.player._id)
        criteria = {
          ...criteria,
          player: req.player._id,
        };

      const history = await Transaction.find(criteria);

      let total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res.status(200).json({
        data: history,
        total: total.length ? total[0].value : 0,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  },

  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const history = await Transaction.findById(id);

      if (!history)
        return res.status(404).json({
          message: "history tidak ditemukan",
        });

      res.status(200).json({
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  },

  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        {
          $match: {
            player: req.player._id,
          },
        },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      await Transaction.populate(count, { path: "category" });

      const category = await Category.find({});

      category.forEach((element) => {
        count.forEach((data) => {
          if (data._id.toString() === element._id.toString()) {
            data.name = element.name;
          }
        });
      });

      const history = await Transaction.find({
        player: req.player._id,
      })
        .populate("category")
        .sort({ updatedAt: -1 });

      res.status(200).json({
        data: {
          history,
          count,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  },

  profile: async (req, res) => {
    try {
      const player = {
        id: req.player._id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        avatar: req.player.avatar,
        phoneNumber: req.player.phoneNumber,
      };

      res.status(200).json({
        data: player,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  },

  editProfile: async (req, res, next) => {
    try {
      const { name = "", phoneNumber = "" } = req.body;
      const payload = {};

      if (name.length) payload.name = name;
      if (phoneNumber.length) payload.phoneNumber = phoneNumber;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt = req.file.originalname.split(".").pop();
        let filename = `${req.file.filename}.${originalExt}`;

        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        console.log(target_path);
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          let player = await Player.findById(req.player._id);

          let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
          if (fs.existsSync(currentImage)) fs.unlinkSync(currentImage);

          payload.avatar = filename;

          player = await Player.findOneAndUpdate(
            {
              _id: req.player._id,
            },
            payload,
            {
              new: true,
              runValidators: true,
            }
          );

          res.status(201).json({
            data: {
              id: player._id,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          });
        });

        src.on("err", async () => {
          next(err);
        });
      } else {
        const player = await Player.findOneAndUpdate(
          {
            _id: req.player._id,
          },
          payload,
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(201).json({
          data: {
            id: player._id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
};

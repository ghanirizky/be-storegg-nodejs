const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      const payments = await Payment.find().populate("banks");
      res.render("admin/payment/view_payment", {
        payments,
        alert,
        name: req.session.user.name,
        title: "Halaman Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();
      res.render("admin/payment/create.ejs", { banks });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal", {
        name: req.session.user.name,
        title: "Halaman Ubah Payment",
      });
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { type, banks } = req.body;
      const payment = await Payment({ type, banks });
      await payment.save();

      req.flash("alertMessage", `Berhasil tambah jenis pembayaran`);
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id).populate("banks");
      const banks = await Bank.find();
      res.render("admin/payment/edit", {
        payment,
        banks,
        name: req.session.user.name,
        title: "Halaman Ubah Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, banks } = req.body;

      await Payment.findOneAndUpdate(
        {
          _id: id,
        },
        { type, banks }
      );

      req.flash("alertMessage", `Berhasil ubah jenis pembayaran`);
      req.flash("alertStatus", "success");

      return res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Payment.findOneAndDelete({
        _id: id,
      });

      req.flash("alertMessage", `Berhasil hapus payment`);
      req.flash("alertStatus", "success");

      return res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const payment = await Payment.findOne({ _id: id });

      const status = payment.status === "Y" ? "N" : "Y";

      payment.status = status;
      await payment.save();

      req.flash("alertMessage", `Berhasil update status jenis pembayaran`);
      req.flash("alertStatus", "success");

      return res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
};

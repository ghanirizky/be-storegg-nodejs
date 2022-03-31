const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      const banks = await Bank.find();
      res.render("admin/bank/view_bank", {
        banks,
        alert,
        name: req.session.user.name,
        title: "Halaman Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  viewCreate: async (req, res) => {
    try {
      res.render("admin/bank/create.ejs", {
        name: req.session.user.name,
        title: "Halaman Create Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, nameBank, noRekening } = req.body;
      const bank = await Bank({ name, nameBank, noRekening });
      await bank.save();

      req.flash("alertMessage", `Berhasil tambah bank`);
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const bank = await Bank.findById(id);
      res.render("admin/bank/edit", {
        bank,
        name: req.session.user.name,
        title: "Halaman Ubah Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, nameBank, noRekening } = req.body;

      await Bank.findOneAndUpdate(
        {
          _id: id,
        },
        { name, nameBank, noRekening }
      );

      req.flash("alertMessage", `Berhasil ubah bank`);
      req.flash("alertStatus", "success");

      return res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Bank.findOneAndDelete({
        _id: id,
      });

      req.flash("alertMessage", `Berhasil hapus nominal`);
      req.flash("alertStatus", "success");

      return res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
};

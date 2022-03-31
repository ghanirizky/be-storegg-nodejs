const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      const nominals = await Nominal.find();
      res.render("admin/nominal/view_nominal", {
        name: req.session.user.name,
        title: "Halaman Ubah Kategori",
        nominals,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create.ejs");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { coinQuantity, coinName, price } = req.body;
      const nominal = await Nominal({ coinQuantity, coinName, price });
      await nominal.save();

      req.flash("alertMessage", `Berhasil tambah nominal`);
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const nominal = await Nominal.findById(id);
      res.render("admin/nominal/edit", {
        nominal,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinQuantity, coinName, price } = req.body;

      await Nominal.findOneAndUpdate(
        {
          _id: id,
        },
        {
          coinQuantity,
          coinName,
          price,
        }
      );

      req.flash("alertMessage", `Berhasil ubah nominal`);
      req.flash("alertStatus", "success");

      return res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Nominal.findOneAndDelete({
        _id: id,
      });

      req.flash('alertMessage', `Berhasil hapus nominal`)
      req.flash('alertStatus', 'success')

      return res.redirect("/nominal");
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/nominal')
    }
  },
};

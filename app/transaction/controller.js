const Transaction = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      const transactions = await Transaction.find().populate('player');
      res.render("admin/transaction/view_transaction.ejs", {
        transactions,
        alert,
        name: req.session.user.name,
        title: "Halaman Transaction",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      const { id } = req.params;
      const {status} = req.query

      await Transaction.findByIdAndUpdate({_id : id}, {
        status : status
      });

      req.flash("alertMessage", `Berhasil update transaction status`);
      req.flash("alertStatus", "success");

      res.redirect('/transaction')

    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
};

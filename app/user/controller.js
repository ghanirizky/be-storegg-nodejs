const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/user/view_signin", {
          alert,
        });
      } else {
        res.redirect("/dashboard");
      }

    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        req.flash("alertMessage", `Email yang anda inputkan salah`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }

      if (user.status !== "Y") {
        req.flash("alertMessage", `Mohon maaf status anda beluma aktif`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        req.flash("alertMessage", `Kata sandi yang anda masukan tidak sesuai`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        status: user.status,
        name: user.name,
      };

      res.redirect("/dashboard");
    } catch (error) {}
  },

  actionLogout : (req, res) => {
    req.session.destroy()
    res.redirect("/")
  }

};

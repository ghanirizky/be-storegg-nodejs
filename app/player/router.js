const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const { isLoginPlayer } = require("../middleware/auth");
const {
  landingPage,
  detailPage,
  category,
  checkout,
  transactionHistory,
  historyDetail,
  dashboard,
  profile,
  editProfile,
} = require("./controller");

router.get("/landingpage", landingPage);
router.get("/:id/detail", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, transactionHistory);
router.get("/history/:id/detail", isLoginPlayer, historyDetail);
router.get("/dashboard", isLoginPlayer, dashboard);
router.get("/profile", isLoginPlayer, profile);
router.put(
  "/profile",
  isLoginPlayer,
  multer({ dest: os.tmpdir() }).single("image"),
  editProfile
);

module.exports = router;

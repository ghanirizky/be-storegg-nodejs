const router = require('express').Router();
const CategoryRouter = require("../app/category/router");
const DashboardRouter = require("../app/dashboard/router");
const NominalRouter = require("../app/nominal/router");
const VoucherRouter = require("../app/voucher/router");
const BankRouter = require("../app/bank/router");
const PaymentRouter = require("../app/payment/router");
const UserRouter = require("../app/user/router");
const TransactionRouter = require("../app/transaction/router");
const {isLoginAdmin} = require('../app/middleware/auth')

router.use("/category", isLoginAdmin, CategoryRouter);
router.use("/nominal", isLoginAdmin,NominalRouter);
router.use("/voucher",isLoginAdmin, VoucherRouter);
router.use("/bank", isLoginAdmin,BankRouter);
router.use("/payment",isLoginAdmin, PaymentRouter);
router.use("/dashboard",isLoginAdmin, DashboardRouter);
router.use("/transaction",isLoginAdmin, TransactionRouter);
router.use("/", UserRouter);


//API 
const PlayerRouter = require("../app/player/router");
const AuthRouter = require("../app/auth/router");
const URL = 'api/v1'

router.use(`/${URL}/players`, PlayerRouter);
router.use(`/${URL}/auth`, AuthRouter);


module.exports = router;

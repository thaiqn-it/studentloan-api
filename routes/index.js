const express = require("express");

const { majorRoute } = require("../routes/major.route");
const { schoolRoute } = require("../routes/school.route");
const { schoolMajorRoute } = require("../routes/schoolmajor.route");
const { accountRouter } = require("./account.route");
const { loanRouter } = require("./loan.route");
const { loanScheduleRouter } = require("./loanSchedule.route");
const { paymentMethodRouter } = require("./paymentMethod.route");
const { reportRouter } = require("./report.route");
const { transactionRouter } = require("./transaction.route");
const { userRoute } = require("./user.route");

const router = express.Router();

router.use("/major", majorRoute);
router.use("/school", schoolRoute);
router.use("/schoolmajor", schoolMajorRoute);
router.use("/loans/", loanRouter);
router.use("/loanSchedules/", loanScheduleRouter);
router.use("/user", userRoute);
router.use("/account", accountRouter);
router.use("/paymentMethod", paymentMethodRouter);
router.use("/report", reportRouter);
router.use("/transaction", transactionRouter);

module.exports = { apiRouter: router };

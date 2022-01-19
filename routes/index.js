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
const { evidenceRoute } = require("../routes/evidence.route");
const { imageRoute } = require("../routes/image.route");
const { investmentRoute } = require("../routes/investment.route");
const { investorRoute } = require("../routes/investor.route");
const { studentRouter } = require("../routes/student.route");
const { stripeRoute } = require("./stripe.route");

const router = express.Router();

router.use("/major", majorRoute);
router.use("/school", schoolRoute);
router.use("/schoolmajor", schoolMajorRoute);
router.use("/loan/", loanRouter);
router.use("/loanSchedule/", loanScheduleRouter);
router.use("/user", userRoute);
router.use("/investor", investorRoute);
router.use("/investment", investmentRoute);
router.use("/account", accountRouter);
router.use("/paymentMethod", paymentMethodRouter);
router.use("/report", reportRouter);
router.use("/transaction", transactionRouter);
router.use("/student", studentRouter);
router.use("/stripe", stripeRoute);

module.exports = { apiRouter: router };

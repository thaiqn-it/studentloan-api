const express = require("express");

const { majorRoute } = require("../routes/major.route");
const { schoolRoute } = require("../routes/school.route");
const { schoolMajorRoute } = require("../routes/schoolmajor.route");
const { loanRouter } = require("./loan.route");
const { loanScheduleRouter } = require("./loanSchedule.route");
const { reportRouter } = require("./report.route");
const { transactionRouter } = require("./transaction.route");
const { userRoute } = require("./user.route");
const { investmentRoute } = require("../routes/investment.route");
const { investorRoute } = require("../routes/investor.route");
const { studentRouter } = require("../routes/student.route");
const { uploadImageRouter } = require("../routes/uploadImag.route");
const { tutorRouter } = require("./tutor.route");
const { paypalRoute } = require("./paypal.route")
const { systemConfigRouter } = require("./systemconfig.route")
const { walletRouter } = require("./wallet.route")

const router = express.Router();

router.use("/major", majorRoute);
router.use("/school", schoolRoute);
router.use("/schoolmajor", schoolMajorRoute);
router.use("/loan", loanRouter);
router.use("/loanSchedule", loanScheduleRouter);
router.use("/user", userRoute);
router.use("/investor", investorRoute);
router.use("/investment", investmentRoute);
router.use("/report", reportRouter);
router.use("/transaction", transactionRouter);
router.use("/student", studentRouter);
router.use("/image", uploadImageRouter);
router.use("/tutor", tutorRouter);
router.use("/paypal", paypalRoute);
router.use("/config", systemConfigRouter);
router.use("/wallet", walletRouter);

module.exports = { apiRouter: router };

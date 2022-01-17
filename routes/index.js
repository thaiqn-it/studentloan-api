const express = require("express");
const { loanRouter } = require("./loan.route");
const { loanScheduleRouter } = require("./loanSchedule.route");
const { userRoute } = require("./user.route");
const { investorRouter } = require("./investor.route");
const { imageRouter } = require("./image.route");
const { evidenceRouter } = require("./evidence.route");
const { uploadImageRouter } = require("../routes/uploadImag.route");

const router = express.Router();

router.use("/loans/", loanRouter);
router.use("/loanSchedules/", loanScheduleRouter);
router.use("/user", userRoute);
router.use("/investor", investorRouter);
router.use("/image", imageRouter);
router.use("/evidence", evidenceRouter);
router.use("/cloudimage", uploadImageRouter);

router.get("/", (req, res) => {
  res.json({
    msg: "Student Loan Api Server",
  });
});

module.exports = { apiRouter: router };

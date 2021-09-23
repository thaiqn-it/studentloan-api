const express = require('express')

const {majorRoute} = require('../routes/major.route')
const {schoolRoute} = require('../routes/school.route')
const {schoolMajorRoute} = require('../routes/schoolmajor.route')
const { loanRouter } = require('./loan.route');
const { loanScheduleRouter } = require('./loanSchedule.route')
const { userRoute } = require("./user.route");
const {evidenceRoute} = require("../routes/evidence.route"); 
const {imageRoute} = require("../routes/image.route"); 
const {investmentRoute} = require("../routes/investment.route"); 
const {investorRoute} = require("../routes/investor.route"); 

const router = express.Router();

router.use("/major",majorRoute)
router.use("/school",schoolRoute)
router.use("/schoolmajor",schoolMajorRoute)
router.use("/loans/", loanRouter)
router.use("/loanSchedules/", loanScheduleRouter)
router.use("/user", userRoute);
router.use("/investor", investorRoute);
router.use("/investment", investmentRoute);
router.use("/image", imageRoute);
router.use("/evidence", evidenceRoute);


module.exports = {apiRouter : router}

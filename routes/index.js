const express = require('express');
const { loanRouter } = require('./loan.route');
const { loanScheduleRouter } = require('./loanSchedule.route')

const router = express.Router();

router.use("/loans/", loanRouter)
router.use("/loanSchedules/", loanScheduleRouter)

router.get("/" , (req , res) =>{
    res.json({
        msg: "Student Loan Api Server"
    })
})

module.exports = {apiRouter : router}
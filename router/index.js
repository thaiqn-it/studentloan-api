const express = require('express')
const { majorRouter } = require("./major.route");

const router = express.Router();

router.use("/majors", majorRouter)

router.get("/" , (req , res) =>{
    res.json({
        msg: "Student Loan Api Server"
    })
})

module.exports = {apiRouter : router}
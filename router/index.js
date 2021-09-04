const express = require('express')

const router = express.Router();

router.get("/" , (req , res) =>{
    res.json({
        msg: "Student Loan Api Server"
    })
})

module.exports = {apiRouter : router}
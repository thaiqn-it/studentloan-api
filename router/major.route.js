const express = require("express");
const { getAllMajor } = require('../controllers/major.controller')
const router = express.Router();

 //router.get("/", getAllMajor)
router.get("/", async (req,res,next) => {
    try {
        const majors = await majorService.getAll();
        return res.json({
            majors
        });
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default());
    }
})

module.exports = { majorRouter: router };
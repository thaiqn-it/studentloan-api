const express = require("express");
const { majorController } = require('../controllers/major.controller')
const router = express.Router();

// router.get("/", majorController.getAll(req,res,next))
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
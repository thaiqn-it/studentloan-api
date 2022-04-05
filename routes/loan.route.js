const express = require("express");
const { loanController } = require("../controllers/loan.controller");
const { body } = require("express-validator");
const { LOAN_STATUS } = require('../models/enum/index')

const router = express.Router();

router.get("/",loanController.findAll);

router.post("/waiting",loanController.findAllWaiting);

router.get("/waiting/:id",loanController.getOne);

router.get("/search",loanController.search);

router.get("/:id", loanController.findById);

router.post(
    "/",

    [
        body("totalMoney")
            .notEmpty()
            .withMessage("Total money should not be empty"),
        body("interest")
            .notEmpty()
            .withMessage("Interest should not be empty"),
        body("description")
            .notEmpty()
            .trim()
            .withMessage("Description should not be empty"),
        body("loanStartAt")
            .notEmpty()
            .withMessage("Start day should not be empty")
            .bail()
            .isISO8601().toDate().withMessage("Start day wrong format"),
        body("loanEndAt")
            .notEmpty()
            .withMessage("End day should not be empty")
            .bail(),
        body("postExpireAt")
            .notEmpty()
            .withMessage("Expire at should not be empty")
            .bail(),
        body("expectedGraduationDay")
            .notEmpty()
            .withMessage("Expected graduation day should not be empty")
            .bail(),
        body("status")
            .notEmpty()
            .isIn(Object.values(LOAN_STATUS))
            .withMessage(`Status should be one of ${Object.values(LOAN_STATUS)}`)
    ], 
    loanController.create
);

router.put("/:id" , loanController.updateById)

module.exports = { loanRouter : router };
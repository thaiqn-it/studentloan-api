const express = require("express");
const { loanController } = require("../controllers/loan.controller");
const { body } = require("express-validator");
const { LOAN_STATUS } = require("../models/enum/index");
const { studentAuth, userAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/", loanController.findAll);

router.get("/pdf/:id",userAuth, loanController.generatePDF);

router.get("/waiting/:id", loanController.getOne);

router.get("/countLoan/:type",loanController.countLoan);

router.get("/search",loanController.search);

router.get("/student", studentAuth, loanController.getLoanStudent);

router.get("/student/:id", studentAuth, loanController.findByIdStudentSide);

router.get("/:id", loanController.findById);

router.post("/waiting", loanController.findAllWaiting);

router.post("/countLoan/",loanController.countLoanBaseTime);

router.post(
  "/",

  [
    body("totalMoney")
      .notEmpty()
      .withMessage("Total money should not be empty"),
    body("interest").notEmpty().withMessage("Interest should not be empty"),
    // body("description")
    //     .notEmpty()
    //     .trim()
    //     .withMessage("Description should not be empty"),
    // body("loanStartAt")
    //     .notEmpty()
    //     .withMessage("Start day should not be empty")
    //     .bail()
    //     .isISO8601().toDate().withMessage("Start day wrong format"),
    // body("loanEndAt")
    //     .notEmpty()
    //     .withMessage("End day should not be empty")
    //     .bail(),
    body("postExpireAt")
      .notEmpty()
      .withMessage("Expire at should not be empty")
      .bail(),
    body("expectedGraduationTime")
      .notEmpty()
      .withMessage("Expected graduation day should not be empty")
      .bail(),
    body("status")
      .notEmpty()
      .isIn(Object.values(LOAN_STATUS))
      .withMessage(`Status should be one of ${Object.values(LOAN_STATUS)}`),
  ],
  studentAuth,
  loanController.create
);

router.put("/:id/:type", loanController.updateById);

module.exports = { loanRouter: router };

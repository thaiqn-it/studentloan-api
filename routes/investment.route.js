const express = require("express");
const investmentController = require("../controllers/invesment.controller");
const { investorAuth, studentAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.post("/", investmentController.createInvestment);

//check exsist by loanId and investorId
router.get("/",investorAuth, investmentController.getAllByInvestorID);

router.get("/:id",investorAuth, investmentController.checkExistInvestmentByInvestorId);

router.put("/:id", investmentController.updateInvestment);

router.delete("/:id", investmentController.deleteInvestment);

module.exports = { investmentRoute: router };

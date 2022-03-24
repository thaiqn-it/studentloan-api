const express = require("express");
const investmentController = require("../controllers/invesment.controller");
const { investorAuth, studentAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.post("/", investmentController.createInvestment);

router.get("/",investorAuth, investmentController.getAllByInvestorID);

//check exsist by loanId and investorId
router.get("/loan/:id",investorAuth, investmentController.checkExistInvestmentByInvestorId);

router.get("/:id", investmentController.findOneById);

router.put("/:id", investmentController.updateInvestment);

router.delete("/:id", investmentController.deleteInvestment);

module.exports = { investmentRoute: router };

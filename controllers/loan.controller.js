const { loanService } = require("../services/loan.service");
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
} = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");

const findAll = async (req, res, next) => {
  try {
    const loans = await loanService.findAll();
    return res.json(loans);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const getLoanStudent = async (req, res, next) => {
  const user = req.user
  try {
    const loans = await loanService.getLoanStudent(user.Student.id);
    return res.json(loans);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const findAllWaiting = async (req, res, next) => {
    const data = req.body
    try {     
        const loans = await loanService.findAllWaiting(data);
        return res.json(loans);
    } catch (error) {
        return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const loan = await loanService.findById(id);
    if (loan === null) throw new Error();
    return res.json({
      loan,
    });
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const getOne = async (req, res, next) => {
    const { id } = req.params;
    try {
        const loan = await loanService.getOne(id);
        if (loan === null) throw new Error();
		return res.json({
			loan,
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

const create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(BAD_REQUEST).json(
      restError.BAD_REQUEST.extra({
        errorParams: mapErrorArrayExpressValidator(errors.array()),
      })
    );
  }
  const data = req.body;
  try {
    const loan = await loanService.create(data);
    
    return res.json(loan);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateById = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const loan = await loanService.updateById(id, data);
    if (loan === null) throw new Error();
    return res.json({
      loan,
    });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const search = async (req, res, next) => {
  const data = req.query;
  try {
    const loans = await loanService.search(data);
    return res.json(loans);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

exports.loanController = { 
    findAll,
    findById,
    create,
    updateById,
    search,
    findAllWaiting,
    getLoanStudent,
    getOne
};

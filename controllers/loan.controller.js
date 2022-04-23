const { loanService } = require("../services/loan.service");
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
} = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
const { loanHistoryService } = require("../services/loanHistory.service");
const { studentService } = require("../services/student.service");
const tutorService = require("../services/tutor.service");
const { LOAN_STATUS, TUTOR_STATUS } = require("../models/enum");
const { createPDF } = require("../utils/generatePDF");

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
  const user = req.user;
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
  const data = req.body;
  try {
    const loans = await loanService.findAllWaiting(data);
    return res.json(loans);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const countLoan = async (req, res, next) => {
  const { type } = req.params;
  try {
    const numberLoan = await loanService.countLoan(type);
    return res.json(numberLoan);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const countLoanBaseTime = async (req, res, next) => {
  try {
    const data = req.body;
    const numberLoan = await loanService.countLoanBaseTime(data);
    return res.json(numberLoan);
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

const findByIdStudentSide = async (req, res, next) => {
  const { id } = req.params;
  const { type } = req.query;
  try {
    const loan = await loanService.findByIdStudentSide(id, type);
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
  const newData = { ...data, studentId: req.user.Student.id };
  try {
    const loan = await loanService.create(newData);
    return res.json(loan);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateById = async (req, res, next) => {
  const { id, type } = req.params;
  const data = req.body;
  const { loan, loanHistory } = data;
  try {
    const returnLoan = await loanService.updateById(id, loan);
    if (returnLoan === null) throw new Error();
    if (type !== LOAN_STATUS.DRAFT) {
      var loanHistoryData = {
        loanId: returnLoan.id,
        type: type,
        isActive: true,
      };
      await loanHistoryService.updateById(loanHistory.id, { isActive: false }).then(res => {
        loanHistoryService.create(loanHistoryData);
      })
    }
    return res.json({
      returnLoan,
    });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const generatePDF = async (req, res, next) => {
  try {
    const { id } = req.params
    const loan = await loanService.getOne(id)
    if (loan === null) throw new Error();
    const student = await studentService.findByUserId(loan.Student.userId)
    var tutorlist = []
    await tutorService.getListTutorByStudentId(student.id).then(res => {
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        if (element.status === TUTOR_STATUS.VERIFIED) {
          tutorlist.push(element)
        }
      }
    }
    )
    const data = {
      loan,
      student,
      tutorlist
    }
    const pdfRes = await createPDF(data)
    return res.json({
      pdfRes,
      loan,
      student,
      tutorlist
    });
  } catch (error) {
    console.log(error)
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
  getOne,
  findByIdStudentSide,
  countLoan,
  countLoanBaseTime,
  generatePDF
};

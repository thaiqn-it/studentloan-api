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
const { LOAN_STATUS, LOAN_SCHEDULE_STATUS, TUTOR_STATUS } = require("../models/enum");
const { loanScheduleService } = require("../services/loanSchedule.service");
const { contractService } = require("../services/contract.service");
const moment = require("moment")
const { studentService } = require("../services/student.service");
const tutorService = require("../services/tutor.service");
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
  const { type } = req.params;
  try {
    const loans = await loanService.getLoanStudent(user.Student.id, type);
    return res.json(loans);
  } catch (error) {
    console.log(error);
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
  const { id, type } = req.params;
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

const randomCharater = (length) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const delayLoan = async (req, res, next) => {
  const { id } = req.params;
  const { duration } = req.body;
  try {
    const loan = await loanService.findById(id);

    const loanStartAt = moment(loan.loanStartAt).add(duration, "M");
    const loanEndAt = moment(loan.loanEndAt).add(duration, "M");
    const newDuration = parseInt(loan.duration) + parseInt(duration);

    const loanSchedules = await loanScheduleService.findAllByLoanIdOption(
      id,
      LOAN_SCHEDULE_STATUS.COMPLETED
    );

    JSON.parse(JSON.stringify(loanSchedules)).forEach((item) => {
      const startAt = moment(item.startAt).add(duration, "M");
      const endAt = moment(item.endAt).add(duration, "M");
    });

    const totalMoneyCompleted =
      await loanScheduleService.getTotalMoneyCompleted();

    const contracts = await contractService.getAllByLoanId(id);

    const randomCha = randomCharater(3);
    const mili =
      (moment().millisecond() < 10
        ? "00"
        : moment().millisecond() < 100
        ? "0"
        : "") + moment().millisecond().toString();
    const second =
      (moment().second() < 10 ? "0" : "") + moment().second().toString();

    const contractCode = randomCha + second + mili;

    const totalRemaining =
      parseFloat(loan.totalMoney) +
      parseFloat(loan.totalMoney) *
        parseFloat(loan.interest) *
        parseFloat(loan.duration) -
      parseFloat(totalMoneyCompleted);

    const data = {
      contractCode,
      total: totalRemaining,
      loanStartAt,
      loanEndAt,
      duration: newDuration,
      interest: loan.interest,
    };

    // const borrower = {
    //   headers: [`Bên vay: ${item.Student.User.firstName + " " + item.Student.User.lastName}`,""],
    //   rows: [
    //       [`Ngày sinh: ${moment(item.Student.User.birthDate).format("DD/MM/YYYY")}`,`Địa chỉ: ${item.Student.User.address}`],
    //       [`Số CMND: ${item.Student.Information.citizenId}`,`Cấp tại : ${item.Student.Information.citizenCardCreatedPlace}     Ngày: ${moment(item.Student.Information.citizenCardCreatedDate).format("DD/MM/YYYY")}`],
    //       [`Email: ${item.Student.User.email}`,`Số ĐT: ${item.Student.User.phoneNumber}`],
    //       // [`Trường: Đại học FPT`,`MSSV : SE141062`],
    //       // [`Người bảo hộ: Nguyễn Quốc Thái Thái thái`,`Số CMND: 357237273`],
    //   ],
    // }

    // const lenders = {
    //   headers: [`Bên cho vay: ${investment.Investor.User.firstName + " " + investment.Investor.User.lastName}`,""],
    //   rows: [
    //       [`Ngày sinh: ${moment(investment.Investor.User.birthDate).format("DD/MM/YYYY")}`,`Địa chỉ: ${investment.Investor.User.address}`],
    //       [`Số CMND: ${investment.Investor.Information.citizenId}`, `Cấp tại : ${investment.Investor.Information.citizenCardCreatedPlace}     Ngày: ${moment(investment.Investor.Information.citizenCardCreatedDate).format("DD/MM/YYYY")}`],
    //       [`Email: ${investment.Investor.User.email}`, `Số điện thoại: ${investment.Investor.User.phoneNumber}`],
    //   ],
    // }

    console.log(data);

    // console.log(JSON.parse(JSON.stringify(loanSchedules)));

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
  delayLoan,
  generatePDF
};

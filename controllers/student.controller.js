const { studentService } = require("../services/student.service");
const tutorService = require("../services/tutor.service");
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
} = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
const { achievementService } = require("../services/achievement.service");
const { updateUserService } = require("../services/user.service");

const findAll = async (req, res, next) => {
  try {
    const students = await studentService.findAll();
    return res.json(students);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await studentService.findById(id);
    if (student === null) throw new Error();
    return res.json({
      student,
    });
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const findByUserId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await studentService.findByUserId(id);
    if (student === null) throw new Error();
    return res.json({
      student,
    });
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const create = async (req, res, next) => {
  const data = req.body;
  try {
    const student = await studentService.create(data);
    return res.json(student);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateById = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const studentId = req.user.Student;
  try {
    const student = await studentService.updateNewStudentById(studentId, data);
    if (student === null) throw new Error();
    return res.json({
      student,
    });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const getStudentProfile = async (req, res, next) => {
  const user = req.user;
  try {
    const student = await studentService.findByUserId(user.id);
    if (student === null) throw new Error();
    var tutors = [];
    var achievements = [];
    if (student.parentId !== null) {
      tutors = await tutorService.getListTutorByStudentId(student.parentId);
      achievements = await achievementService.getByStudentId(student.parentId);
    }

    return res.json({
      student,
      tutors,
      achievements,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const updateStudentProfile = async (req, res, next) => {
  const param = req.params;
  const data = req.body;
  const { studentInfo, userType } = data;
  try {
    const student = await studentService.updateNewStudentById(
      param.id,
      studentInfo
    );
    if (userType) {
      const user = await updateUserService(req.user.id, userType);
    }

    if (student === null) throw new Error();
    return res.json({
      student,
    });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

exports.studentController = {
  findAll,
  findById,
  create,
  updateById,
  findByUserId,
  getStudentProfile,
  updateStudentProfile,
};

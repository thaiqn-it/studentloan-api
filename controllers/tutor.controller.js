const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");

const tutorService = require("../services/tutor.service");

const createTutor = async (req, res) => {
  try {
    const data = req.body;
    const newData = {...data, studentId: req.user.Student.id}
    const tutor = await tutorService.create(newData);
    res.json(tutor);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const tutorData = { id, ...data };
    const tutor = await tutorService.update(tutorData);
    res.json(tutor);
  } catch (err) {
      console.log(err)
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const tutor = await tutorService.getById(id);
    if (tutor === null)
      return res
        .status(BAD_REQUEST)
        .json(restError.BAD_REQUEST.extra({ msg: "Tutor not exist" }));
    res.json(tutor);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const tutor = await tutorService.deleteById(id);

    res.json(tutor);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const getListTutorByStudentId = async (req, res) => {
  try {
    const id = req.params.id;
    const tutor = await tutorService.getListTutorByStudentId(id);
    if (tutor === null)
      return res
        .status(BAD_REQUEST)
        .json(restError.BAD_REQUEST.extra({ msg: "Tutor not exist" }));
    res.json(tutor);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const tutorController = { createTutor, update, getById, deleteById, getListTutorByStudentId }
module.exports = {tutorController} ;

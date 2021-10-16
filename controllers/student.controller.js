const { studentService } = require("../services/student.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
  
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

const create = async (req, res, next) => {
    // const errors = validationResult(req); 
	// 	if (!errors.isEmpty()) {
	// 		return res.status(BAD_REQUEST).json(
	// 			restError.BAD_REQUEST.extra({
	// 				errorParams: mapErrorArrayExpressValidator(errors.array()),
	// 			})
	// 		);
	// 	}
    const { data } = req.body

    try {      
        const student = await studentService.create(data)
        return res.json(student);
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const updateById = async (req,res,next) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const student = await studentService.updateById(id, data)
        if (student === null) throw new Error();
		return res.json({
			student,
		});
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default());
    }
}

exports.studentController = { 
    findAll,
    findById,
    create,
    updateById,
};
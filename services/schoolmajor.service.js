const {SchoolMajor} = require("../models")

const findAllSchoolMajor = async() => {
    return await SchoolMajor.findAll();
}

const findOneSchoolMajorById = async(majorId, schoolId) => {
    return await SchoolMajor.findOne({
        where:{
            majorId : majorId,
            schoolId: schoolId
        }
    });
}

const createNewSchoolMajor = async(schoolMajor) => {
    return await SchoolMajor.create(schoolMajor);
}

const updateSchoolMajor = async (majorId, schoolId,data) => {
    return await SchoolMajor.update(data, {
        where:{
            majorId : majorId,
            schoolId: schoolId
        }
    })
}

exports.schoolMajorServices = {findAllSchoolMajor, findOneSchoolMajorById, createNewSchoolMajor, updateSchoolMajor}
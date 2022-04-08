const {School} = require("../models")
const {SCHOOL_STATUS} = require("../models/enum")

const findAllSchool = async() => {
    return await School.findAll({
        where : {
            status : SCHOOL_STATUS.ACTIVE 
        }
    });
}

const findOneSchool = async(id) => {
    return await School.findOne({
        where:{
            id : id
        }
    });
};

const createNewSchool = async(school) => {
    return await School.create(school);
}

const deleteById = async (id) => {
    return await School.destroy({
        where : {
            id : id
        }
    })
}

const updateById = async (id,data) => {
    return await School.update(data, {
        where : {
            id : id
        }
    })
}

exports.schoolServices = {
    findAllSchool, 
    findOneSchool, 
    createNewSchool, 
    deleteById, 
    updateById, 
}
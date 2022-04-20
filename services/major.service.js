
const { MAJOR_STATUS, SCHOOL_STATUS } = require("../models/enum");
const db = require("../models/index");

const findAllMajor = async (id) => {
    return await db.Major.findAll({
        attributes: ["id", "name", "status"],
        where: {
            status: SCHOOL_STATUS.ACTIVE,
        },
        include: {
            model: db.SchoolMajor,
            where: {
                schoolId: id
            },
        },
    });
};

const getAll = async () => {
    return await db.Major.findAll({
        where: {
            status: MAJOR_STATUS.ACTIVE,
        }
    });
};

const getOne = async (id) =>{
    return await db.Major.findOne({
        where:{
            id:id,
            status:MAJOR_STATUS.ACTIVE
        }
    })
}

const isDuplicatedName = async (name) => {
    return await db.Major.findOne({
        where:{
            name:name,
            status:MAJOR_STATUS.ACTIVE
        }
    })
}

const createNewMajor = async (data) => {
    await db.Major.create(data)
};

const update = async (id, data) => {
    await db.Major.update(data, {
        where: {
            id
        }
    }
    )
};

exports.majorService = {
    findAllMajor,
    createNewMajor,
    update,
    getAll,
    isDuplicatedName,
    getOne
}


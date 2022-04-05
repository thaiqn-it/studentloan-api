
const db = require("../models/index");

const findAllMajor = async (id) => {
    return await db.Major.findAll({
        attributes: ["id", "name", "status"],
        where: {
            status: 'ACTIVE',
        },
        include:{
            model: db.SchoolMajor,
            where: {
                schoolId: id
            },
        },
    });
};

const createNewMajor = async (data) => {
    const schoolMajor = {
        majorId: data.id,
        schoolId: data.schoolId,
        status: data.status,
    };
     const major ={
        id: data.id,
        name: data.name,
        status: data.status,
    }    
    await db.Major.create(major).then(db.SchoolMajor.create(schoolMajor))
};

const update = async (id,data) => {
    await db.Major.update(data, {
            where: {
                id
            }
        }
    )
    await db.SchoolMajor.update(data, 
        {
            where: {
                majorid: id
            }
        }
    )
};

exports.majorService = {
    findAllMajor,
    createNewMajor,
    update,
}


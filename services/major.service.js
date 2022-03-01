
const db = require("../models/index");

const findAllMajor = async (id) => {
    return await db.Major.findAll({
        attributes: ["id", "name", "parentId", "status"],
        where: {
            status: 'ACTIVE',
        },
        include: [
            {
                model: db.SchoolMajor,
                attributes: [],
                where: {
                    schoolId: id
                }
            }
        ],
    });
};

const createNewMajor = async (data) => {
    var schoolMajor = {};
    var major = {};
    data.map(async (item)=>{
        schoolMajor = {
            majorId:item.id,
            schoolId:item.schoolId,
            status:item.status,
        };
        major ={
            id: item.id,
            name:item.name,
            parentId:item.parentId,
            status:item.status,
        }
        await db.Major.create(major).then(await db.SchoolMajor.create(schoolMajor))
    })
};

const update = async (data) => {
    data.map(async (items) => {
        await db.Major.update(
            {
                parentId: items.parent,
                name: items.text,
                status: items.status
            }
            , {
                where: {
                    id: items.id
                }
            }
        )
        await db.SchoolMajor.update(
            {
                status:items.status
            }, {
                where: {
                    majorid: items.id
                }
            }
        )
    })
};

exports.majorService = {
    findAllMajor,
    createNewMajor,
    update,
}


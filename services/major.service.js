
const db = require("../models/index");

const findAllMajor = async() => {
    return await db.Major.findAll({
        attributes: ["id","name"],
        where : {
            parentId : null,
            status : 'true'
        },
        include: [{
            model: db.Major,
            as : 'children',
            attributes: ["id","name"],
        }],
        
    });
};

const findOneMajor = async(id) => {
    return await db.Major.findOne({
        where:{
            id : id
        }
    });
};

const createNewMajor = async(major) => {
    return await db.Major.create(major);
};

const createSubMajor = async(data) =>{
    return await db.Major.create(data);
}

const updateById = async (id,data) => {
    return await db.Major.update(data, {
        where : {
            id : id
        }
    })
};

exports.majorService = {findAllMajor, createNewMajor, updateById, findOneMajor, createSubMajor}



// const deleteById = async (id) => {
//     return await Major.destroy({
//         where : {
//             MajorId : id
//         }
//     })
// };


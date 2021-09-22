const {Major} = require("../models")

const findAllMajor = async() => {
    return await Major.findAll();
};

const findOneMajor = async(id) => {
    return await Major.findOne({
        where:{
            id : id
        }
    });
};

const createNewMajor = async(major) => {
    return await Major.create(major);
};

const createSubMajor = async(data) =>{
    return await Major.create(data);
}

const updateById = async (id,data) => {
    return await Major.update(data, {
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


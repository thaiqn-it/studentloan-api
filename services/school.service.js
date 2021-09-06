const { School } = require('../models/school.model')

const getAll = async () => {
    return await School.findAll()
} 

const getOneById = async (id) => {
    return await School.findByPk(id)
}

const deleteById = async (id) => {
    return await School.destroy({
        where : {
            id : id
        }
    })
}

const updateById = async (id,data) => {
    return School.update(data, {
        where : {
            id : id
        }
    })
}

module.exports = {
    schoolService : {
        getAll,
        getOneById,
        deleteById,
        updateById,
    }
}
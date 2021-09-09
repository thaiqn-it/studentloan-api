const db = require('../models/index')

const getAll = async () => {
    return await db.School.findAll({ raw : true })
} 

const getOneById = async (id) => {
    return await db.School.findByPk(id)
}

const deleteById = async (id) => {
    return await db.School.destroy({
        where : {
            id : id
        }
    })
}

const updateById = async (id,data) => {
    return db.School.update(data, {
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
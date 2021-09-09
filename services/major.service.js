const db = require('../models/index')

const getAll = async () => {
    return await db.Major.findAll()
} 

const getOneById = async (id) => {
    return await db.Major.findByPk(id)
}

const deleteById = async (id) => {
    return await db.Major.destroy({
        where : {
            id : id
        }
    })
}

const updateById = async (id,data) => {
    return db.Major.update(data, {
        where : {
            id : id
        }
    })
}

module.exports = {
    majorService : {
        getAll,
        getOneById,
        deleteById,
        updateById,
    }
}
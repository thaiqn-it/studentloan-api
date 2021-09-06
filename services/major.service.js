const { Major } = require('../models/major.model')

const getAll = async () => {
    return await Major.findAll()
} 

const getOneById = async (id) => {
    return await Major.findByPk(id)
}

const deleteById = async (id) => {
    return await Major.destroy({
        where : {
            id : id
        }
    })
}

const updateById = async (id,data) => {
    return Major.update(data, {
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
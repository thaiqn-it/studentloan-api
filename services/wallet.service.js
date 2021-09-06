const { Wallet } = require('../models/wallet.model')

const getAll = async () => {
    return await Wallet.findAll()
}

module.exports = {
    walletService : {
        getAll,
    }
}
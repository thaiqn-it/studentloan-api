const express = require('express')

const {majorRoute} = require('../routes/major.route')
const {schoolRoute} = require('../routes/school.route')
const {schoolMajorRoute} = require('../routes/schoolmajor.route')

const router = express.Router();

router.use("/major",majorRoute)
router.use("/school",schoolRoute)
router.use("/schoolmajor",schoolMajorRoute)


module.exports = {apiRouter : router}
const { INTERNAL_SERVER_ERROR } = require("http-status");
const reportService = require("../services/report.service");
const { restError } = require("../errors/rest");

const createReport = async (req, res) => {
  try {
    const { loanId, imageId, description, status } = req.body;
    const data = {
      loanId,
      imageId,
      description,
      status,
    };
    const report = await reportService.createReportService(data);
    res.json(report);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateReport = async (req, res) => {
  try {
    const id = req.params;
    const { loanId, imageId, description, status } = req.body;
    const data = {
      id,
      loanId,
      imageId,
      description,
      status,
    };
    const report = await reportService.updateReportService(data);
    res.json(report);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const getReport = async (req, res) => {
  try {
    const id = req.params;
    const report = await reportService.getReportService(id);
    res.json(report);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const deleteReport = async (req, res) => {
  try {
    const id = req.params;
    const report = await reportService.deleteReportService(id);
    res.json(report);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

exports.reportController = {
  createReport,
  updateReport,
  deleteReport,
  getReport,
};

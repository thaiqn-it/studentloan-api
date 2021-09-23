const db = require("../models");
const Report = db.Report;

const createReportService = async (report) => {
  return await Report.create(report);
};

const updateReportService = async (data) => {
  let report = await Report.findByPk(data.id);
  if (report === null) throw new Error();
  report = { ...report, ...data };
  return report.save();
};

const getReportService = async (id) => {
  return await Report.findByPk(id);
};

const deleteReportService = async (id) => {
  const report = await report.findByPk(id);
  return await report.destroy();
};

module.exports = {
  createReportService,
  updateReportService,
  deleteReportService,
  getReportService,
};

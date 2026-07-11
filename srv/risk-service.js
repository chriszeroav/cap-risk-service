const cds = require("@sap/cds");

const { getRiskSummary } = require("./risk/handlers/risk-summary-handler");
const {
  getSuppliersByRiskLevel,
} = require("./risk/handlers/suppliers-by-risk-level-handler");

module.exports = cds.service.impl(function () {
  const { Suppliers, SupplierCategories } = this.entities;

  this.on("getRiskSummary", async () => {
    return getRiskSummary(Suppliers);
  });

  this.on("getSuppliersByRiskLevel", async (req) => {
    return getSuppliersByRiskLevel(req, Suppliers, SupplierCategories);
  });
});

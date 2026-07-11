const cds = require("@sap/cds");

const { SELECT } = cds.ql;

async function getRiskSummary(Suppliers) {
  const suppliers = await cds.run(
    SELECT.from(Suppliers).columns("ID", "status", "riskScore", "riskLevel"),
  );

  const totalSuppliers = suppliers.length;
  const lowRiskCount = suppliers.filter(
    (supplier) => supplier.riskLevel === "LOW",
  ).length;
  const mediumRiskCount = suppliers.filter(
    (supplier) => supplier.riskLevel === "MEDIUM",
  ).length;
  const highRiskCount = suppliers.filter(
    (supplier) => supplier.riskLevel === "HIGH",
  ).length;
  const blockedCount = suppliers.filter(
    (supplier) => supplier.status === "BLOCKED",
  ).length;
  const totalRiskScore = suppliers.reduce(
    (sum, supplier) => sum + Number(supplier.riskScore || 0),
    0,
  );

  const averageRiskScore =
    totalSuppliers === 0
      ? 0
      : Math.round((totalRiskScore / totalSuppliers) * 100) / 100;

  return {
    totalSuppliers,
    lowRiskCount,
    mediumRiskCount,
    highRiskCount,
    blockedCount,
    averageRiskScore,
  };
}

module.exports = {
  getRiskSummary,
};

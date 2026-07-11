const cds = require("@sap/cds");

const { SELECT } = cds.ql;

const ALLOWED_RISK_LEVELS = ["LOW", "MEDIUM", "HIGH"];

async function getSuppliersByRiskLevel(req, Suppliers, SupplierCategories) {
  const { riskLevel } = req.data;

  if (!ALLOWED_RISK_LEVELS.includes(riskLevel)) {
    return req.reject(
      400,
      `Invalid riskLevel '${riskLevel}'. Use LOW, MEDIUM or HIGH.`,
    );
  }

  const suppliers = await cds.run(
    SELECT.from(Suppliers)
      .where({ riskLevel })
      .columns(
        "ID",
        "name",
        "country",
        "status",
        "riskScore",
        "riskLevel",
        "category_ID",
      ),
  );

  const categories = await cds.run(
    SELECT.from(SupplierCategories).columns("ID", "name"),
  );

  const categoryNameById = Object.fromEntries(
    categories.map((category) => [category.ID, category.name]),
  );

  return suppliers.map((supplier) => ({
    ID: supplier.ID,
    supplierName: supplier.name,
    country: supplier.country,
    status: supplier.status,
    riskScore: supplier.riskScore,
    riskLevel: supplier.riskLevel,
    categoryName: categoryNameById[supplier.category_ID] || null,
  }));
}

module.exports = {
  getSuppliersByRiskLevel,
};

const cds = require("@sap/cds");

module.exports = function () {
  const { Suppliers, SupplierCategories } = cds.entities("risk");

  this.on("getRiskSummary", async () => {
    const suppliers = await cds.run(
      SELECT.from(Suppliers).columns("ID", "status", "riskScore", "riskLevel"),
    );

    const totalSuppliers = suppliers.length;

    const lowRiskCount = suppliers.filter((s) => s.riskLevel === "LOW").length;
    const mediumRiskCount = suppliers.filter(
      (s) => s.riskLevel === "MEDIUM",
    ).length;
    const highRiskCount = suppliers.filter(
      (s) => s.riskLevel === "HIGH",
    ).length;
    const blockedCount = suppliers.filter((s) => s.status === "BLOCKED").length;

    const totalRiskScore = suppliers.reduce((sum, supplier) => {
      return sum + Number(supplier.riskScore || 0);
    }, 0);

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
  });

  this.on("getSuppliersByRiskLevel", async (req) => {
    const { riskLevel } = req.data;

    const allowedRiskLevels = ["LOW", "MEDIUM", "HIGH"];

    if (!allowedRiskLevels.includes(riskLevel)) {
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
  });
};

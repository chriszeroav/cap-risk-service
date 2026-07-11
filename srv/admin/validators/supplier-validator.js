const cds = require("@sap/cds");

const { isValidEmail } = require("./email-validator");

const { SELECT } = cds.ql;

function expectedRiskLevelForScore(riskScore) {
  if (riskScore <= 49) return "LOW";
  if (riskScore <= 79) return "MEDIUM";

  return "HIGH";
}

function getEntityIdFromRequest(req) {
  return req.params?.[0]?.ID || req.data?.ID;
}

function validateSupplierFinalState(req, data) {
  if (data.email && !isValidEmail(data.email)) {
    return req.reject(400, "Supplier email has an invalid format.");
  }

  if (data.riskScore !== undefined && data.riskScore !== null) {
    const riskScore = Number(data.riskScore);

    if (!Number.isInteger(riskScore)) {
      return req.reject(400, "riskScore must be an integer.");
    }

    if (riskScore < 0 || riskScore > 100) {
      return req.reject(400, "riskScore must be between 0 and 100.");
    }

    if (data.riskLevel) {
      const expectedRiskLevel = expectedRiskLevelForScore(riskScore);

      if (data.riskLevel !== expectedRiskLevel) {
        return req.reject(
          400,
          `riskLevel must be ${expectedRiskLevel} when riskScore is ${riskScore}.`,
        );
      }
    }
  }

  if (data.status === "BLOCKED") {
    if (data.riskLevel !== "HIGH") {
      return req.reject(400, "A BLOCKED supplier must have riskLevel HIGH.");
    }

    if (Number(data.riskScore) < 80) {
      return req.reject(400, "A BLOCKED supplier must have riskScore >= 80.");
    }
  }

  if (Array.isArray(data.contacts)) {
    for (const contact of data.contacts) {
      if (contact.email && !isValidEmail(contact.email)) {
        return req.reject(
          400,
          `Contact email '${contact.email}' has an invalid format.`,
        );
      }
    }
  }
}

async function validateSupplierCreate(req) {
  return validateSupplierFinalState(req, req.data);
}

async function validateSupplierUpdate(req, Suppliers) {
  const supplierId = getEntityIdFromRequest(req);

  if (!supplierId) {
    return req.reject(400, "Supplier ID is required for update.");
  }

  const tx = cds.tx(req);

  const currentSupplier = await tx.run(
    SELECT.one.from(Suppliers).where({ ID: supplierId }),
  );

  if (!currentSupplier) {
    return req.reject(404, `Supplier '${supplierId}' was not found.`);
  }

  const finalState = {
    ...currentSupplier,
    ...req.data,
  };

  return validateSupplierFinalState(req, finalState);
}

module.exports = {
  validateSupplierCreate,
  validateSupplierUpdate,
};

const { isValidEmail } = require("./email-validator");

function validateContactPayload(req) {
  const data = req.data;

  if (req.event === "CREATE" && !data.supplier_ID) {
    return req.reject(
      400,
      "supplier_ID is required when creating a contact directly.",
    );
  }

  if (data.email && !isValidEmail(data.email)) {
    return req.reject(400, "Contact email has an invalid format.");
  }
}

module.exports = {
  validateContactPayload,
};

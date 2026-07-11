const cds = require("@sap/cds");

const {
  validateSupplierCreate,
  validateSupplierUpdate,
} = require("./admin/validators/supplier-validator");
const {
  validateContactPayload,
} = require("./admin/validators/contact-validator");

module.exports = cds.service.impl(function () {
  const { Suppliers, SupplierContacts } = this.entities;

  this.before("CREATE", Suppliers, validateSupplierCreate);

  this.before("UPDATE", Suppliers, (req) => {
    return validateSupplierUpdate(req, Suppliers);
  });

  this.before(["CREATE", "UPDATE"], SupplierContacts, validateContactPayload);
});

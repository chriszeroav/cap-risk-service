namespace risk;

using {
    cuid,
    managed
} from '@sap/cds/common';

type SupplierStatus : String enum {
    ACTIVE;
    BLOCKED;
    INACTIVE;
}

type RiskLevel      : String enum {
    LOW;
    MEDIUM;
    HIGH;
}

type ContactRole    : String enum {
    PROCUREMENT_MANAGER;
    FINANCE_CONTACT;
    OPERATIONS_MANAGER;
    RISK_OFFICER;
    SALES_REPRESENTATIVE;
    ACCOUNT_EXECUTIVE;
}

aspect ContactInfo {
    email : String(120);
    phone : String(40);
}

aspect RiskProfile {
    riskScore : Integer default 0;

    @assert.range
    riskLevel : RiskLevel default #LOW;
}

entity SupplierCategories : cuid, managed {
    name        : String(80);
    description : String(255);
}

entity Suppliers : cuid, managed, ContactInfo, RiskProfile {
    name     : String(120);
    country  : String(60);
    taxId    : String(40);

    @assert.range
    status   : SupplierStatus default #ACTIVE;

    category : Association to SupplierCategories;

    contacts : Composition of many SupplierContacts
                   on contacts.supplier = $self;
}

entity SupplierContacts : cuid, managed, ContactInfo {
    supplier  : Association to Suppliers;

    firstName : String(80);
    lastName  : String(80);

    @assert.range
    role      : ContactRole;

    isPrimary : Boolean default false;
}

using {risk as db} from '../db/schema';

type RiskSummary {
    totalSuppliers   : Integer;
    lowRiskCount     : Integer;
    mediumRiskCount  : Integer;
    highRiskCount    : Integer;
    blockedCount     : Integer;
    averageRiskScore : Decimal(9, 2);
}

type SupplierRiskResult {
    ID           : UUID;
    supplierName : String(120);
    country      : String(60);
    status       : String(20);
    riskScore    : Integer;
    riskLevel    : String(20);
    categoryName : String(80);
}

service AdminService {
    entity Suppliers          as projection on db.Suppliers;
    entity SupplierCategories as projection on db.SupplierCategories;
    entity SupplierContacts   as projection on db.SupplierContacts;
}

service RiskService {
    @readonly
    entity SupplierRisks           as
        projection on db.Suppliers {
            ID,
            name          as supplierName,
            country,
            status,
            riskScore,
            riskLevel,

            category,
            category.name as categoryName
        };

    @readonly
    entity HighRiskSuppliers       as
        projection on db.Suppliers {
            ID,
            name          as supplierName,
            country,
            status,
            riskScore,
            riskLevel,
            category.name as categoryName
        }
        where
            riskLevel = 'HIGH';

    @readonly
    entity BlockedSuppliers        as
        projection on db.Suppliers {
            ID,
            name          as supplierName,
            country,
            status,
            riskScore,
            riskLevel,
            category.name as categoryName
        }
        where
            status = 'BLOCKED';

    @readonly
    entity PeruSuppliers           as
        projection on db.Suppliers {
            ID,
            name          as supplierName,
            country,
            status,
            riskScore,
            riskLevel,
            category.name as categoryName
        }
        where
            country = 'Peru';

    @readonly
    entity PublicSupplierDirectory as
        projection on db.Suppliers {
            ID,
            name          as supplierName,
            country,
            status,
            category.name as categoryName
        };

    @readonly
    entity SupplierRiskSnapshot    as
        projection on db.Suppliers {
            *
        }
        excluding {
            taxId,
            email,
            phone,
            contacts,
            createdBy,
            modifiedBy
        };

    @readonly
    entity SupplierCategories      as
        projection on db.SupplierCategories {
            ID,
            name
        };


    @readonly
    entity SupplierRiskCards       as
        projection on db.Suppliers {
            ID,
            name          as supplierName,
            country,
            riskScore,
            riskLevel,
            category.name as categoryName
        };

    function getRiskSummary()                           returns RiskSummary;

    function getSuppliersByRiskLevel(riskLevel: String) returns array of SupplierRiskResult;
}

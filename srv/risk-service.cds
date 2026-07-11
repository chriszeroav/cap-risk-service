using {risk as db} from '../db/schema';
using {RiskSummary, SupplierRiskResult} from './common/risk-types';

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

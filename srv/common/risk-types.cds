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

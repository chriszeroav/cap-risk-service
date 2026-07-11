using {risk as db} from '../db/schema';

service AdminService {
    entity Suppliers          as projection on db.Suppliers;
    entity SupplierCategories as projection on db.SupplierCategories;
    entity SupplierContacts   as projection on db.SupplierContacts;
}

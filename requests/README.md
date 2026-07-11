# Requests

Coleccion de consultas manuales para probar los servicios OData locales.

Base local esperada:

```text
http://localhost:4004/odata/v4
```

## Estructura

- `admin/`: consultas contra el servicio administrativo.
- `admin/suppliers/`: CRUD y validaciones de proveedores administrados.
- `admin/supplier-categories/`: consultas administrativas de categorias.
- `admin/supplier-contacts/`: CRUD de contactos de proveedores.
- `risk/`: consultas contra el servicio de riesgos.
- `risk/functions/`: funciones OData expuestas por el servicio de riesgos.
- `risk/supplier-*`: consultas por vistas o entidades relacionadas con proveedores.
- `unknown-scenarios.rest`: escenarios manuales pendientes de clasificar.

## Convencion de nombres

- `read-*`: consultas `GET`.
- `create-*`: consultas `POST`.
- `update-*`: consultas `PATCH`.
- `delete-*`: consultas `DELETE`.
- `validate-*`: casos negativos o reglas de validacion.
- `verify-*`: comprobaciones posteriores a una operacion.

Los archivos numerados (`01-*`, `02-*`) mantienen un orden sugerido de ejecucion.

# Verificación de la primera etapa

Fecha: 04/11/2026. Ejecución local con asistencia de Codex. Node.js 24.20.0, npm 11.19.0 y MongoDB 9.0 local en puerto 27028. Base temporal exclusiva: `sumarimpacto_tp3_revision_test`. No se usó Atlas ni se comprobó una URL pública.

## Procedencia

ZIP original: `desarrollo_SumarImpacto_V2.0.zip`.

SHA256: `cb21d745f1d2ee744c7ca3fb6ce9203d1569a03a9b8d92e2354efa3ff0b9adec`.

No se modificó el ZIP. Se conservó el código de modelos, controladores, rutas, vistas y suites existentes. Los ajustes de esta etapa corresponden a scripts, metadatos y documentación.

## Resultados ejecutados

| Caso o comando | Entrada / resultado esperado | Obtenido |
|---|---|---|
| npm ci --ignore-scripts --no-audit --no-fund | Instalar dependencias fijadas | 125 paquetes instalados; salida 0. |
| npm ci --offline --ignore-scripts --no-audit --no-fund | Reinstalar tras ajustar metadatos sin cambiar dependencias | 125 paquetes instalados; salida 0. |
| npm test | Modelos, vistas y HTTP con consultas simuladas | 10 aprobadas, 0 fallidas. |
| node --test tests/donante.integration.test.js | CRUD, datos inválidos, duplicados, referencias, bajas y reapertura con base real | 12 aprobadas, 0 fallidas; incluye 11 casos y una contenedora. |
| node --test tests/proyecto.integration.test.js | CRUD, validaciones, ID duplicado/inválido/inexistente y persistencia al reabrir | 15 aprobadas, 0 fallidas; incluye 14 casos y una contenedora. |
| npm run db:check | URI de la base local temporal; conectar, ping y cerrar | Salida 0 y mensaje de comprobación correcta. |
| scripts/comprobarConexion.js sin MONGODB_URI | Rechazar configuración faltante | Salida 1 y mensaje controlado. |
| scripts/comprobarConexion.js con servidor inaccesible y credenciales ficticias | Informar fallo sin exponer la clave | Salida 1; comprobación automática confirmó que no apareció la clave ficticia. |
| package.json / package-lock.json | Igualdad de dependencias declaradas | Comprobado; no se agregaron ni actualizaron dependencias. |

Las suites de integración se ejecutaron secuencialmente. Los resultados de V2 del README histórico no se cuentan como resultados nuevos. `npm test` se repitió al cerrar la preparación; no se suman esas ejecuciones como casos distintos.

## Incidencias y límites

La primera ejecución restringida dejó pasar ocho pruebas locales y bloqueó dos conexiones HTTP por EACCES. La repetición con acceso local completó las diez. Fue una restricción del entorno, no un fallo funcional demostrado.

La evidencia disponible es la salida de terminal de esta sesión y este registro; no se generaron capturas de Postman. La persistencia se verificó al reabrir HTTP y Mongoose, sin reiniciar el proceso mongod. Las pruebas automatizadas modificaron únicamente datos de la base temporal de prueba.

Pendientes: revisión del equipo, autenticación, autorización, middlewares, vistas y despliegue público.

## Verificación manual en Atlas

Angel realizó estas comprobaciones el 05/11/2026 con SumarImpacto 3.0.0-dev.1. La aplicación se ejecutó localmente con la base alojada en Atlas.

| Prueba | Resultado observado |
|---|---|
| Conexión desde la aplicación | El comando de comprobación recibió respuesta al ping. |
| Alta y persistencia tras reiniciar la aplicación | El proyecto Prueba Atlas y la Empresa de prueba Atlas conservaron sus identificadores y el vínculo. |
| Consulta directa en Atlas | El campo proyectoAsignado del donante coincide con el identificador del proyecto. |

Las capturas están en el registro de aportes del equipo. Las pruebas automatizadas anteriores usaron MongoDB local. En Atlas se comprobaron el alta, la lectura y la persistencia de los datos ficticios.

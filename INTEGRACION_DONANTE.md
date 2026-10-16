# Integración de Donante Corporativo — PR #5

Preparación: 15/10/2026 (Argentina). Base: aporte de David b38aa49 y actualización de main 3ac003f.

Se conserva el modelo Mongoose, CRUD asincrónico, referencia a Proyecto e importador de David. Se corrigen importación del modelo, negociación HTML/JSON, referencias y formularios. Las vistas de donantes se adaptan al controlador actual; esto no fusiona ni cierra el PR #3 de Gastón.

## Comportamiento

- Ruta base /donanteCorporativo. GET listado, GET /:id, POST alta, PUT /:id y DELETE /:id.
- Formularios GET /nuevo, GET /eliminar, GET /:id/editar, POST /:id/editar y POST /eliminar (campo idDonante).
- _id identifica nuevos donantes. idDonanteCorporativo se conserva al importar datos históricos y permite consultas por número. Las altas HTTP no asignan ni aceptan identificadores históricos nuevos; tampoco se modifican por HTTP.
- El proyecto se selecciona por ObjectId en el formulario. La API acepta proyectoAsignado o el alias proyectoAsignadoId, como ObjectId o número idProyecto. Se verifica su existencia; vacío o null desvincula y omitirlo al editar conserva el vínculo.
- CUIT se guarda sin guiones/espacios, con 11 dígitos e índice único. No se verifica el dígito fiscal ni la existencia ante ARCA. Razón social obligatoria; correo opcional con formato simple; monto finito no negativo; monedas ARS/USD; estados activo/inactivo normalizados.
- JSON de escritura recibe JSON aun sin Accept. Para GET de API usar Accept: application/json. Formularios redirigen al listado. Validación 400, inexistencia 404, duplicado de CUIT 409, error interno 500.
- DELETE Proyecto devuelve 409 si encuentra donantes vinculados. Primero reasignar o desvincular. No elimina donantes en cascada.

## Importación optativa

No ejecutar la importación para probar el CRUD. Los ejemplos JSON no se importan al arrancar.

El script carga correctamente Proyecto con require('../models/proyectoManager') y relaciona proyectoAsignadoId con idProyecto, sin usar nombres que podrían repetirse. Primero valida todos los registros y sus referencias. Si falta un proyecto no importa donantes; deben existir previamente los proyectos con sus números históricos correctos.

Verificación sin escrituras de donantes (usa MONGODB_URI de .env):

```cmd
node scripts/migrarDonantes.js
```

Solo después de revisar la base de destino y respaldarla, importación explícita:

```cmd
node scripts/migrarDonantes.js --aplicar
```

Usa el CUIT normalizado como clave y $setOnInsert: repetir no duplica ni sobrescribe donantes ya existentes con ese CUIT normalizado. No normaliza automáticamente documentos almacenados con versiones anteriores del modelo: revisar esos datos antes de importar. Un fallo durante las escrituras puede dejar una importación parcial; no hay transacción de lote. Corregir y repetir conserva los ya importados.

## Verificación

Ejecutadas durante la preparación: 10 pruebas locales aprobadas, 0 fallidas, con:

```cmd
node --test tests/proyecto.test.js tests/donante.test.js
```

Incluyen validación real de modelos, renderizado Pug y HTTP con consultas simuladas. No acreditan persistencia MongoDB. Posteriormente, Ángel ejecutó la suite de Donante y la regresión de Proyecto contra MongoDB real en Windows con Node.js 24.20.0 y npm 11.19.0. El 15/10/2026 informó 12 pruebas aprobadas de Donante (11 casos y la contenedora), 15 de Proyecto (14 casos y la contenedora) y las 10 pruebas locales, todas con 0 fallos. La base utilizada por ambas suites, ejecutadas por separado, fue mongodb://127.0.0.1:27017/sumarimpacto_donante_integracion_test. Estos resultados son de su ejecución local compartida; no se reinició mongod ni se ejecutó el importador CLI completo contra los JSON de ejemplo.

En Windows CMD, con MongoDB iniciado, ejecutar estas suites UNA POR VEZ. La suite Donante elimina TODOS los donantes y proyectos de la base de prueba al comenzar y terminar; usar exclusivamente una base descartable terminada en _test:

```cmd
set "MONGODB_URI_TEST=mongodb://127.0.0.1:27017/sumarimpacto_donante_integracion_test"
node --test tests/donante.integration.test.js
node --test tests/proyecto.integration.test.js
```

Donante contiene 11 casos y una prueba contenedora. Comprueba CRUD, errores, duplicados, referencia por número/ObjectId, edición web, bloqueo de eliminación de proyecto, preparación de importación e inserción repetida, identificador histórico y persistencia al cerrar/reabrir HTTP y Mongoose. No reinicia mongod ni ejecuta el importador CLI completo contra los ejemplos de producción.

## Límites pendientes

La comprobación de referencias y la baja de Proyecto son operaciones separadas: altas/bajas concurrentes pueden competir. No hay transacciones ni bloqueo distribuido, autenticación o autorización. Antes de un uso concurrente real debe definirse una estrategia transaccional con una topología MongoDB adecuada. Los formularios muestran errores de validación como JSON; no conservan automáticamente los datos ingresados al fallar. Publicar y revisar las correcciones del PR #5 antes de fusionarlo, revisar PR #3 y completar la documentación final antes de la entrega.

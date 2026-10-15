# Integración del aporte de Proyecto

Fecha: 15/10/2026.

## Alcance y procedencia

Se conserva el esquema Mongoose y el CRUD asincrónico aportados por Adriana en el PR #4, corrigiendo su integración con Express y Pug. Se toman como referencia las vistas de listado y eliminación de Proyecto del PR #3 de Gastón. Se completa el formulario de alta con todos los campos requeridos y se agrega edición web.

Los archivos de Donante Corporativo no cambian: ese módulo continúa en JSON. El PR #3 incluye también vistas de donantes que esperan MongoDB; por eso no debe fusionarse completo mientras su controlador siga usando JSON.

## Decisiones de integración

- Se usa CommonJS (`require`/`module.exports`), como el punto de entrada y el resto del proyecto.
- La ruta base es `/proyecto`, en singular.
- `_id` es el identificador de MongoDB mostrado en el listado y usado por los enlaces de edición.
- `idProyecto` conserva el número de negocio del modelo original. Las rutas aceptan tanto ese entero positivo como un ObjectId de 24 caracteres hexadecimales. El parámetro se llama `idProyecto` por compatibilidad con las rutas originales.
- Al crear se admite `idProyecto`; si no se informa, se calcula el máximo más uno. El índice único rechaza duplicados con 409. Dos altas simultáneas pueden competir por el mismo número: se debe reintentar la que reciba 409. No se agrega un servicio de secuencias en esta práctica.
- Al actualizar no se cambian los identificadores. Solo se copian los campos permitidos.
- `fechaFin` es opcional. Un campo vacío se guarda como `null`. Si existe, no puede ser anterior a `fechaInicio`; esto se valida también en modificaciones parciales mediante validación del documento completo.
- Estados: `planificación`, `en ejecución`, `finalizado`, `cancelado`. Se normalizan a minúsculas; no se reinterpretan `activo` ni `pendiente`.
- Monedas: ARS o USD. Presupuesto no negativo, correo con formato simple y campos de texto obligatorios sin espacios vacíos.
- Los formularios reciben redirecciones a `/proyecto`. Con `Content-Type: application/json`, las escrituras reciben JSON incluso sin Accept explícito. Para consultas API usar `Accept: application/json`.

## Archivos y responsabilidades

| Archivo | Responsabilidad |
|---|---|
| `models/proyectoManager.js` | Esquema, modelo e invariantes del documento; ya no es un administrador JSON. |
| `controllers/proyectoController.js` | CRUD asincrónico, selección de respuesta HTML/JSON y errores. |
| `routes/proyectoRoutes.js` | Enlace entre URL, método HTTP y controlador. |
| `views/proyectos/_formulario.pug` | Campos compartidos de alta y edición. |
| `views/proyectos/nuevo.pug` | Formulario de alta. |
| `views/proyectos/editar.pug` | Formulario de edición con datos existentes. |
| `views/proyectos/listar.pug` | Listado, ObjectId, número y enlace de edición. |
| `views/proyectos/eliminar.pug` | Formulario de baja compatible con ObjectId. |
| `tests/proyecto.integration.test.js` | Verificación HTTP contra una base MongoDB descartable. |

## API y formularios

Base local: `http://localhost:3000`. En Postman seleccionar Body → raw → JSON para las escrituras y el encabezado `Accept: application/json`.

| Método | Ruta | Entrada | Respuesta normal |
|---|---|---|---|
| GET | `/proyecto` | Sin cuerpo | 200: arreglo de proyectos; HTML si se solicita una vista. |
| GET | `/proyecto/:idProyecto` | ObjectId o número en URL | 200: documento JSON. |
| POST | `/proyecto` | Campos del ejemplo siguiente | 201: `{ mensaje, proyecto }`; formulario web: 302. |
| PUT | `/proyecto/:idProyecto` | Campos que se desea actualizar | 200: `{ mensaje, proyecto }`. |
| DELETE | `/proyecto/:idProyecto` | Sin cuerpo | 200: `{ mensaje }`. |
| GET | `/proyecto/nuevo` | Sin cuerpo | 200: formulario. |
| GET | `/proyecto/:idProyecto/editar` | Identificador en URL | 200: formulario con datos. |
| POST | `/proyecto/:idProyecto/editar` | Formulario con campos editados | 302 hacia `/proyecto`. |
| GET | `/proyecto/eliminar` | Sin cuerpo | 200: formulario. |
| POST | `/proyecto/eliminar` | Formulario: `idProyecto` | 302 hacia `/proyecto`. |

Errores de los controladores de Proyecto: 400 para validación o identificador inválido; 404 para registro inexistente; 409 para número duplicado; 500 para error interno, sin exponer su detalle en la respuesta.

Ejemplo de alta:

```json
{
  "nombre": "Apoyo escolar",
  "organizacion": "Asociación de ejemplo",
  "descripcion": "Clases de apoyo para la comunidad",
  "ubicacion": "Buenos Aires",
  "categoria": "Educación",
  "presupuestoObjetivo": 10000,
  "moneda": "ARS",
  "fechaInicio": "2026-10-15",
  "fechaFin": "",
  "estado": "planificación",
  "responsable": "Persona de ejemplo",
  "email_responsable": "responsable@example.com"
}
```

Guardar el `_id` de la respuesta para consultar, modificar o eliminar. Ejemplo de actualización: `{"nombre":"Apoyo escolar actualizado"}`.

## Verificación ejecutada

El 15/10/2026, Ángel ejecutó las pruebas en Windows con Node.js 24.22.0 y npm 11.19.1, después de actualizar las dependencias y retirar Nodemon. Los resultados compartidos fueron:

- `node --test tests/proyecto.test.js`: 5 pruebas aprobadas, 0 fallidas.
- `node --test tests/proyecto.integration.test.js`: 15 pruebas aprobadas, 0 fallidas (14 casos y la prueba contenedora).
- Última auditoría informada por npm: 0 vulnerabilidades conocidas en las dependencias instaladas.

Se comprobaron CRUD HTTP, formularios, identificadores numéricos y ObjectId, validaciones, duplicados y persistencia al cerrar y reabrir el servidor HTTP y la conexión Mongoose contra la misma base. No se reinició el servicio MongoDB ni se verificó la migración de Donante Corporativo.

La base descartable utilizada fue `mongodb://127.0.0.1:27017/sumarimpacto_integracion_test`. La suite elimina los proyectos de esa base al comenzar y terminar. Estos resultados corresponden a la ejecución local informada por Ángel; complementan las pruebas iniciales realizadas durante la preparación de las correcciones.

## Herramienta de desarrollo

Se retiró Nodemon y sus dependencias de observación. `npm run dev` utiliza el modo estable `node --watch index.js`, incluido en Node.js 24. El comando `npm start` sigue ejecutando `node index.js`. Las correcciones compatibles de dependencias se conservan en package-lock.json.

## Reproducir las pruebas

Instalar las dependencias con `npm ci`. Iniciar MongoDB y utilizar una base exclusiva de pruebas cuyo nombre termine en `_test`. El script elimina los proyectos de esa base al comenzar y al terminar; nunca usar una base con información real.

Símbolo del sistema de Windows (CMD):

```bat
set "MONGODB_URI_TEST=mongodb://127.0.0.1:27017/sumarimpacto_integracion_test"
node --test tests/proyecto.integration.test.js
```

PowerShell:

```powershell
$env:MONGODB_URI_TEST="mongodb://127.0.0.1:27017/sumarimpacto_integracion_test"
node --test tests/proyecto.integration.test.js
```

Bash:

```sh
MONGODB_URI_TEST=mongodb://127.0.0.1:27017/sumarimpacto_integracion_test node --test tests/proyecto.integration.test.js
```

La suite recorre altas, consultas por ambos identificadores, modificación parcial, edición web, eliminación web/API, duplicados, datos inválidos y 404. Verifica persistencia cerrando y reabriendo servidor HTTP y conexión Mongoose contra la misma base. No reinicia el proceso `mongod`.

## Límites de esta etapa

- Los JSON de ejemplo no se importan automáticamente a MongoDB. La base nueva comienza vacía.
- Los donantes todavía referencian números históricos y usan JSON. La integridad entre módulos y la política de eliminación de proyectos vinculados están pendientes de su migración; no hay borrado en cascada ni validación cruzada agregada aquí.
- La asignación de números no es una secuencia transaccional.
- No se incorporan autenticación, nuevos módulos ni dependencias de ejecución.

## Relación con los materiales

D3: operaciones asincrónicas con async/await. D6: routers, Pug y organización MVC. D8: Mongoose, Instalación y Esquemas; conexión, definición de campos y modelos. Se conserva el uso de `require` presentado por D8. Los archivos de la cursada permanecen intactos.

## Defensa oral

Explicar la diferencia entre `_id` e `idProyecto`, el recorrido ruta → controlador → modelo → MongoDB, por qué se espera cada operación, cómo se valida una actualización parcial, por qué hay respuestas HTML y JSON, y qué prueba acredita persistencia.

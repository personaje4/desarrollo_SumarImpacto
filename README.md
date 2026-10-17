# SumarImpacto - Segundo parcial de Desarrollo Web Back End

Aplicación web para gestionar proyectos y donantes corporativos mediante Node.js, Express, vistas Pug y persistencia en MongoDB con Mongoose.

## Identificación y equipo

- Institución: IFST N.º 29.
- Comisión: Jueves 19:15 hs - 2.º B.
- Instancia: segundo parcial, producto mínimo viable.
- Grupo: 4.
- Integrantes y nombres completos:
●	Angel Dominguez 
●	Adriana Lazzeretti 
●	David Carlos Ruiz Flores 
●	Gastón Escobar.


### Integrantes y responsabilidades

| Integrante | Responsabilidad acordada | Aportes registrados en GitHub |
|---|---|---|
| **Angel Dominguez** | Coordinación, conexión a MongoDB, integración de módulos, verificación y reunión de la documentación. | Configuración de la conexión a MongoDB y del arranque del servidor. Recuperación y organización del repositorio. Integración y corrección de los aportes de Proyecto y Donante Corporativo, incluyendo controladores, validaciones, referencias y vistas. Incorporación de pruebas automatizadas, registro de resultados, documentación técnica y actualización del README. |
| **Adriana Lazzeretti** | Migración del módulo Proyecto a MongoDB con Mongoose, validaciones y operaciones asincrónicas. | Aporte inicial de la migración de Proyecto mediante modificaciones en el modelo, controlador y rutas, posteriormente integrado y ajustado en la versión conjunta. |
| **David Carlos Ruiz Flores** | Migración del módulo Donante Corporativo a MongoDB con Mongoose, validaciones y operaciones asincrónicas. | Aporte inicial del modelo, controlador y rutas de Donante Corporativo, referencia a Proyecto y script de importación de datos, posteriormente integrados y ajustados en la versión conjunta. |
| **Gastón Escobar** | Adaptación de vistas Pug y coordinación de las pruebas manuales previstas. | Aportes de adaptación de formularios y listados Pug de Proyecto y Donante Corporativo. En la integración final se incorporó la confirmación antes de eliminar donantes, conservando las adaptaciones necesarias para los modelos y controladores actuales. |

Los aportes se integraron en una versión común. Las responsabilidades de documentación, explicación del trabajo, revisión final y entrega individual corresponden a todos los integrantes, según el cronograma acordado.

## Objetivo, problema y alcance

Centralizar el registro de proyectos y donantes corporativos, permitir su consulta y actualización, y relacionar un donante con un proyecto existente.

El alcance implementado comprende:
- Alta, listado, consulta individual, modificación y eliminación de proyectos.
- Alta, listado, consulta individual, modificación y eliminación de donantes corporativos.
- Formularios web y endpoints con respuestas JSON.
- Validación en el servidor y persistencia en MongoDB.
- Asignación, reasignación y desvinculación de un donante respecto de un proyecto.
- Rechazo de la eliminación de proyectos que tengan donantes vinculados.


## Relación con la consigna y la cursada

| Requisito general | Implementación | Material relacionado |
|---|---|---|
| Arquitectura modular | Carpetas de rutas, controladores, modelos, vistas y configuración. | D6: Introducción a Express. |
| MongoDB y Mongoose | Conexión, esquemas, modelos, validaciones y referencia entre documentos. | D8: Bases de datos en Express. |
| Middlewares, rutas y errores | Procesamiento JSON y formularios; routers; respuestas de validación, inexistencia, duplicados y fallos internos. | D6: Introducción a Express. |
| Validaciones simples | Reglas de los esquemas y comprobación de proyectos referenciados. | D8: Bases de datos en Express. |
| Programación asincrónica | Operaciones con Mongoose mediante async/await. | D3: Asincronismo Web. |
| API y comprobación HTTP | Métodos GET, POST, PUT y DELETE; ejemplos para Postman y pruebas de integración. | D7: API REST básica con Node y Express. |
| Ejecución y módulos | Node.js, npm y CommonJS. | D5: Fundamentos de Node.js. |

## Tecnologías y dependencias

- Node.js: se recomienda la versión 24 LTS utilizada como referencia del proyecto.
- npm: instalación reproducible mediante package-lock.json.
- MongoDB: servicio local o instancia accesible.
- Express: servidor, rutas y middlewares.
- Mongoose: conexión, modelos y validación.
- Pug: plantillas HTML.
- dotenv: carga de variables de entorno.
- node:test y node:assert: pruebas incluidas en Node.js.

Las versiones de dependencias se encuentran en package.json y package-lock.json. No se necesita instalar Nodemon.

## Instalación y ejecución

### 1. Descargar el proyecto

```sh
git clone https://github.com/personaje4/desarrollo_SumarImpacto.git
cd desarrollo_SumarImpacto
npm ci
```

También puede descargarse el ZIP desde GitHub, descomprimirlo e instalar las dependencias dentro de la carpeta del proyecto.

### 2. Configurar el entorno

Copiar .env.example a .env. En PowerShell:

```powershell
Copy-Item .env.example .env
```

Contenido para MongoDB local:

```dotenv
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/sumarimpacto
```

PORT indica el puerto HTTP; MONGODB_URI identifica el servidor y la base de datos. Para Atlas, utilizar la URI correspondiente y configurar el acceso a la instancia. No publicar credenciales. El archivo .env está excluido de Git.

### 3. Iniciar MongoDB y la aplicación

Con MongoDB disponible:

```sh
npm start
```

Abrir http://localhost:3000. Para reiniciar automáticamente ante cambios en módulos JavaScript:

```sh
npm run dev
```

El servidor espera la conexión a MongoDB antes de aceptar solicitudes. Si falta MONGODB_URI o falla la conexión, informa el error y no inicia la escucha HTTP.

Una base nueva comienza vacía. Los archivos de data/ no se importan automáticamente.

## Estructura y responsabilidades

```text
config/database.js                 Conexión a MongoDB
index.js                           Configuración y arranque de Express
routes/                            Rutas de Proyecto y Donante Corporativo
controllers/                       Operaciones CRUD, respuestas y errores
models/                            Esquemas y modelos Mongoose
views/                             Inicio y formularios/listados Pug
data/                              Datos JSON de ejemplo
scripts/migrarDonantes.js           Verificación e importación optativa
tests/                             Pruebas locales y de integración
INTEGRACION_PROYECTO.md             Decisiones y ejemplos de Proyecto
INTEGRACION_DONANTE.md              Decisiones e importación de Donante
DIAGNOSTICO_TP2.md                  Diagnóstico histórico, no estado actual
```

Aunque sus nombres terminan en Manager, los archivos de models/ exportan modelos Mongoose. El CRUD habitual ya no lee ni escribe los JSON.

## Funcionamiento y decisiones

Una solicitud llega a una ruta, que invoca un controlador. El controlador consulta o modifica documentos mediante el modelo Mongoose y devuelve JSON o renderiza/redirige una vista Pug.

Se espera cada operación de base de datos con async/await y se capturan errores en los controladores. Los middlewares de Express procesan JSON y formularios. Actualmente no existe un middleware global propio de errores ni de rutas inexistentes.

- MongoDB genera el identificador _id.
- Proyecto conserva además idProyecto, un entero positivo único. Si se omite al crear, se calcula el máximo existente más uno.
- Las rutas de Proyecto aceptan ObjectId o idProyecto.
- Los donantes nuevos se identifican por _id. idDonanteCorporativo se conserva para datos históricos importados; las altas HTTP no lo asignan ni lo aceptan como identificador nuevo.
- Los identificadores existentes no se modifican por HTTP.
- Al eliminar un proyecto vinculado, se responde 409. Primero deben reasignarse o desvincularse sus donantes.

## Modelo de datos

### Proyecto

Colección predeterminada de Mongoose: proyectos.

| Campo | Tipo y regla principal |
|---|---|
| _id | ObjectId generado por MongoDB. |
| idProyecto | Número entero positivo, obligatorio y único. |
| nombre, organizacion, descripcion, ubicacion, categoria, responsable | Texto obligatorio, sin espacios vacíos. |
| presupuestoObjetivo | Número obligatorio mayor o igual que cero. |
| moneda | ARS o USD, obligatoria. |
| fechaInicio | Fecha obligatoria. |
| fechaFin | Fecha opcional; null si está vacía; no anterior a fechaInicio. |
| estado | planificación, en ejecución, finalizado o cancelado; normalizado a minúsculas. |
| email_responsable | Correo obligatorio con validación de formato simple. |
| createdAt, updatedAt | Fechas automáticas de creación y modificación. |

### Donante Corporativo

Colección predeterminada de Mongoose: donantecorporativos.

| Campo | Tipo y regla principal |
|---|---|
| _id | ObjectId generado por MongoDB. |
| idDonanteCorporativo | Número histórico opcional, entero positivo. |
| razonSocial | Texto obligatorio. |
| cuit | Texto obligatorio y único de 11 dígitos; elimina guiones y espacios. |
| rubro, personaContacto | Texto opcional. |
| emailContacto | Correo opcional con validación simple; se normaliza a minúsculas. |
| montoTotalDonado | Número finito no negativo; valor inicial 0. |
| moneda | ARS o USD; valor inicial ARS. |
| estado | activo o inactivo; valor inicial activo. |
| proyectoAsignado | ObjectId opcional con referencia a Proyecto; valor inicial null. |
| createdAt, updatedAt | Fechas automáticas. |

Un proyecto puede tener varios donantes; cada donante puede tener un proyecto asignado o ninguno. No se verifica el dígito fiscal del CUIT ni su existencia ante ARCA.

## API y uso con Postman

Base local: http://localhost:3000.

Para consultas JSON, enviar Accept: application/json. Para altas y modificaciones, seleccionar Body → raw → JSON; Postman debe enviar Content-Type: application/json.

| Método | Ruta | Entrada | Respuesta satisfactoria |
|---|---|---|---|
| GET | /proyecto | Sin cuerpo. | 200, arreglo de proyectos. |
| GET | /proyecto/:idProyecto | ObjectId o número en la ruta. | 200, documento. |
| POST | /proyecto | JSON de proyecto. | 201, { mensaje, proyecto }. |
| PUT | /proyecto/:idProyecto | JSON con campos a modificar. | 200, { mensaje, proyecto }. |
| DELETE | /proyecto/:idProyecto | Identificador en la ruta. | 200, { mensaje }. |
| GET | /donanteCorporativo | Sin cuerpo. | 200, arreglo de donantes con proyecto poblado. |
| GET | /donanteCorporativo/:idDonante | ObjectId o número histórico. | 200, documento con proyecto poblado. |
| POST | /donanteCorporativo | JSON de donante. | 201, { mensaje, donante }. |
| PUT | /donanteCorporativo/:idDonante | JSON con campos a modificar. | 200, { mensaje, donante }. |
| DELETE | /donanteCorporativo/:idDonante | Identificador en la ruta. | 200, { mensaje }. |

Las actualizaciones aceptan campos parciales. Los errores de los controladores usan { mensaje }: 400 para datos o identificadores inválidos, 404 para registros inexistentes, 409 para duplicados o proyecto con donantes y 500 para fallos internos. El detalle interno de un error 500 no se envía al cliente. Los errores del parser de Express y las rutas desconocidas utilizan su tratamiento predeterminado.

### Ejemplo: crear y modificar un proyecto

POST /proyecto:

```json
{
  "nombre": "Apoyo escolar",
  "organizacion": "Asociación de ejemplo",
  "descripcion": "Clases de apoyo para la comunidad",
  "ubicacion": "Buenos Aires",
  "categoria": "Educación",
  "presupuestoObjetivo": 10000,
  "moneda": "ARS",
  "fechaInicio": "2026-10-17",
  "fechaFin": "",
  "estado": "planificación",
  "responsable": "Persona de ejemplo",
  "email_responsable": "responsable@example.com"
}
```

Guardar proyecto._id de la respuesta. Consultar GET /proyecto/ID_OBTENIDO y modificar con PUT /proyecto/ID_OBTENIDO:

```json
{ "nombre": "Apoyo escolar actualizado" }
```

### Ejemplo: crear y vincular un donante

POST /donanteCorporativo; reemplazar ID_DEL_PROYECTO por el _id real obtenido:

```json
{
  "razonSocial": "Empresa de ejemplo",
  "cuit": "30-12345678-9",
  "rubro": "Servicios",
  "personaContacto": "Contacto de ejemplo",
  "emailContacto": "contacto@example.com",
  "montoTotalDonado": 5000,
  "moneda": "ARS",
  "proyectoAsignado": "ID_DEL_PROYECTO",
  "estado": "activo"
}
```

Es un CUIT ilustrativo para probar formato, no una validación fiscal. La API también acepta proyectoAsignadoId como alias y puede resolver el número idProyecto.

Guardar donante._id. Para desvincularlo, PUT /donanteCorporativo/ID_DEL_DONANTE:

```json
{ "proyectoAsignado": null }
```

Omitir el campo al editar conserva el vínculo; null o cadena vacía lo elimina. Una referencia inexistente devuelve 400.

### Formularios web

| Método | Ruta | Función |
|---|---|---|
| GET | / | Inicio. |
| GET | /proyecto y /donanteCorporativo | Listados al solicitar HTML. |
| GET | /proyecto/nuevo y /donanteCorporativo/nuevo | Formularios de alta. |
| GET | /proyecto/:idProyecto/editar y /donanteCorporativo/:idDonante/editar | Formularios de edición. |
| POST | Las mismas rutas de edición | Guarda cambios y redirige al listado. |
| GET | /proyecto/eliminar y /donanteCorporativo/eliminar | Formularios de baja. |
| POST | /proyecto/eliminar | Recibe idProyecto. |
| POST | /donanteCorporativo/eliminar | Recibe idDonante. |

Las altas web utilizan POST sobre las rutas base. Las escrituras web satisfactorias redirigen con 302; los errores de validación se muestran como JSON.

Más detalles: [Proyecto](INTEGRACION_PROYECTO.md) y [Donante Corporativo](INTEGRACION_DONANTE.md).

## Pruebas y resultados

### Reproducir

Pruebas locales, con consultas simuladas cuando corresponde:

```sh
node --test tests/proyecto.test.js tests/donante.test.js
```

Para integración, iniciar MongoDB y definir una base **exclusiva y descartable**, cuyo nombre termine en _test. Las suites eliminan datos al comenzar y terminar; Donante elimina documentos de ambos modelos. Nunca utilizar una base con información real.

En PowerShell, ejecutar las suites una por vez:

```powershell
$env:MONGODB_URI_TEST="mongodb://127.0.0.1:27017/sumarimpacto_integracion_test"
node --test tests/donante.integration.test.js
node --test tests/proyecto.integration.test.js
```

### Verificación del 17/10/2026

Se ejecutaron los archivos de prueba de la versión revisada de main en una copia local, utilizando dependencias ya instaladas y MongoDB local real. No se comprobó una instalación limpia mediante npm ci.

| Ejecución | Resultado obtenido |
|---|---|
| proyecto.test.js y donante.test.js | 10 pruebas aprobadas, 0 fallidas. |
| donante.integration.test.js | 12 aprobadas, 0 fallidas: 11 casos y una prueba contenedora. |
| proyecto.integration.test.js | 15 aprobadas, 0 fallidas: 14 casos y una prueba contenedora. |

Base exclusiva utilizada: sumarimpacto_revision_20261017_test. Las ejecuciones fueron secuenciales. La evidencia disponible fue la salida de terminal de la revisión; no se adjuntan capturas ni un informe de CI en este repositorio.

| Caso y entrada | Resultado esperado | Resultado obtenido |
|---|---|---|
| Alta con datos válidos | 201 y documento persistido. | Aprobado en ambos módulos. |
| Campos inválidos, montos negativos o fechas incoherentes | 400, sin alta inválida. | Aprobado para los casos de las suites. |
| Identificador inválido o registro inexistente | 400 o 404, respectivamente. | Aprobado. |
| Número de proyecto o CUIT duplicado | 409. | Aprobado. |
| Donante con proyecto inexistente | 400. | Aprobado. |
| Eliminación de proyecto vinculado | 409 y conservación del proyecto. | Aprobado. |
| Modificación y eliminación por API/formulario | Respuesta o redirección prevista y cambio persistido. | Aprobado. |
| Cierre y reapertura de HTTP y conexión Mongoose | Conservación de documentos. | Aprobado. |
| Preparación de importación e inserción repetida | Referencias válidas y ausencia de duplicación por CUIT. | Aprobado en los casos de integración. |

Las pruebas locales no demuestran persistencia. Las de integración sí comprobaron persistencia al reabrir HTTP/Mongoose; no reiniciaron el servicio mongod ni ejecutaron el importador CLI completo contra los JSON de ejemplo. Los resultados previos del 15/10/2026 están registrados en los documentos de integración.

## Importación optativa de ejemplos

No es necesaria para utilizar ni probar el CRUD. Antes de importar donantes deben existir los proyectos con los números históricos referenciados en data/donanteCorporativo.json.

Verificar el archivo y las referencias sin insertar donantes:

```sh
node scripts/migrarDonantes.js
```

Solo después de comprobar la base de destino de MONGODB_URI y respaldarla, aplicar:

```sh
node scripts/migrarDonantes.js --aplicar
```

El script usa el CUIT normalizado como clave y conserva documentos existentes. No importa proyectos, no normaliza automáticamente documentos antiguos y no ejecuta una transacción de lote; un fallo de escritura puede dejar una importación parcial.

## Dificultades, soluciones y limitaciones

- Se reemplazó la persistencia JSON del CRUD por modelos y operaciones Mongoose.
- Se adaptaron las vistas a ObjectId y se conservaron identificadores históricos donde corresponde.
- Se unificaron formatos de CUIT, estados y fechas, y se agregaron validaciones en el servidor.
- La referencia a Proyecto se verifica antes de guardar donantes y se bloquea la baja de proyectos vinculados.
- Las comprobaciones de referencias y las bajas son operaciones separadas: no garantizan integridad ante todas las carreras concurrentes.
- El cálculo máximo más uno de idProyecto puede competir entre altas simultáneas; un duplicado devuelve 409 y requiere reintento.
- Los formularios no conservan automáticamente sus datos ante un error de validación.
- No hay autenticación, autorización ni transacciones. No se agregaron como requisitos de esta instancia.
- Falta comprobar la instalación desde cero y completar los entregables documentales.

El aprendizaje central es comprender el recorrido de una solicitud, diferenciar validación de persistencia y respaldar las afirmaciones de funcionamiento con pruebas reproducibles.

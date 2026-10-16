# SumarImpacto segunda entrega

Aplicación de gestión de proyectos y donantes corporativos con Express y vistas Pug.

## Avance actual

El servidor espera la conexión a MongoDB antes de aceptar solicitudes. Proyecto y Donante Corporativo usan modelos Mongoose, CRUD asincrónico y vistas de alta, listado, edición y baja. Los datos JSON de ejemplo no se importan automáticamente. La integración de Donante Corporativo se prepara en el PR #5 y se documenta en [INTEGRACION_DONANTE.md](INTEGRACION_DONANTE.md); su verificación con MongoDB real está pendiente.

La integración de Proyecto se documenta en [INTEGRACION_PROYECTO.md](INTEGRACION_PROYECTO.md), con decisiones, endpoints, ejemplos para Postman y limitaciones.

## Instalación y ejecución

Requisitos: Node.js 24 LTS con npm y MongoDB local iniciado como servicio.

Desde esta carpeta:

```sh
npm install
```

Copiar .env.example a .env si todavía no existe. Configuración local:

```dotenv
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/sumarimpacto
```

El archivo .env está excluido de Git. Si se usa Atlas, no publicar la URI con credenciales.

```sh
npm start
```

Abrir http://localhost:3000. Para desarrollo, `npm run dev` ejecuta `node --watch index.js` y reinicia el servidor al cambiar módulos JavaScript. No se requiere Nodemon.

## Archivos de esta etapa

- config/database.js: conecta con Mongoose usando MONGODB_URI y limita el tiempo de selección del servidor a cinco segundos.
- index.js: carga la configuración con dotenv, espera conectarDB y luego inicia Express. Informa fallos de conexión o del servidor.
- .env.example: ejemplo público de configuración.
- package.json y package-lock.json: dependencias y comandos de ejecución.

## Verificación realizada

El 10 de octubre de 2026 se ejecutó la función conectarDB desde Node.js contra mongodb://127.0.0.1:27017/sumarimpacto. Resultado obtenido: «Conexión a MongoDB establecida», cierre de la conexión y salida con código 0. Esta comprobación inicial no escribió documentos. Las pruebas CRUD y de persistencia del 15/10/2026 se registran a continuación.

## Pendientes

Ejecutar las pruebas de integración de Donante Corporativo y la regresión de Proyecto, revisar el PR #3 de vistas, decidir qué datos de ejemplo importar y completar la documentación final. Consultar DIAGNOSTICO_TP2.md como diagnóstico histórico de la primera entrega.

## Verificación de la integración de Proyecto (15/10/2026)

El 15/10/2026, Ángel ejecutó las pruebas en Windows con Node.js 24.22.0 y npm 11.19.1, después de actualizar las dependencias y retirar Nodemon. Los resultados compartidos fueron:

- `node --test tests/proyecto.test.js`: 5 pruebas aprobadas, 0 fallidas.
- `node --test tests/proyecto.integration.test.js`: 15 pruebas aprobadas, 0 fallidas (14 casos y la prueba contenedora).
- Última auditoría informada por npm: 0 vulnerabilidades conocidas en las dependencias instaladas.

Se comprobaron CRUD HTTP, formularios, identificadores numéricos y ObjectId, validaciones, duplicados y persistencia al cerrar y reabrir el servidor HTTP y la conexión Mongoose contra la misma base. No se reinició el servicio MongoDB ni se verificó la migración de Donante Corporativo.

La base descartable utilizada fue `mongodb://127.0.0.1:27017/sumarimpacto_integracion_test`. La suite elimina los proyectos de esa base al comenzar y terminar. Estos resultados corresponden a la ejecución local informada por Ángel; complementan las pruebas iniciales realizadas durante la preparación de las correcciones.


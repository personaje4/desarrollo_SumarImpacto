# SumarImpacto segunda entrega

Aplicación de gestión de proyectos y donantes corporativos con Express y vistas Pug.

## Avance actual

El servidor espera la conexión a MongoDB antes de aceptar solicitudes. Proyecto usa un modelo Mongoose, CRUD asincrónico y vistas de alta, listado, edición y baja. Donante Corporativo todavía guarda información en JSON. Los datos JSON de ejemplo no se importan automáticamente.

La integración de Proyecto se documenta en [INTEGRACION_PROYECTO.md](INTEGRACION_PROYECTO.md), con decisiones, endpoints, ejemplos para Postman y limitaciones.

## Instalación y ejecución

Requisitos: Node.js con npm y MongoDB local iniciado como servicio.

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

Abrir http://localhost:3000. Para desarrollo también puede usarse npm run dev.

## Archivos de esta etapa

- config/database.js: conecta con Mongoose usando MONGODB_URI y limita el tiempo de selección del servidor a cinco segundos.
- index.js: carga la configuración con dotenv, espera conectarDB y luego inicia Express. Informa fallos de conexión o del servidor.
- .env.example: ejemplo público de configuración.
- package.json y package-lock.json: dependencias y comandos de ejecución.

## Verificación realizada

El 10 de octubre de 2026 se ejecutó la función conectarDB desde Node.js contra mongodb://127.0.0.1:27017/sumarimpacto. Resultado obtenido: «Conexión a MongoDB establecida», cierre de la conexión y salida con código 0. Esta comprobación no escribió documentos ni verifica todavía CRUD o persistencia.

## Pendientes

Ejecutar la suite de integración contra MongoDB, migrar Donante Corporativo, resolver las referencias y la eliminación de proyectos vinculados, planificar la importación de datos y completar la documentación final. Consultar DIAGNOSTICO_TP2.md como diagnóstico histórico de la primera entrega.

## Verificación de la integración de Proyecto (15/10/2026)

`node --test tests/proyecto.test.js`: cinco pruebas aprobadas (validación Mongoose, fechas, vistas Pug y rutas HTTP con consultas simuladas). Las simulaciones no verifican persistencia.

Se intentó iniciar MongoDB temporal 8.0.16 y 7.0.24; ambos procesos terminaron con código 100 y «open: Operation not permitted» en este entorno. Por eso el CRUD contra MongoDB y la persistencia no se dan por verificados. La suite reproducible queda en `tests/proyecto.integration.test.js`; requiere `MONGODB_URI_TEST` apuntando a una base descartable, según INTEGRACION_PROYECTO.md. No fusionar hasta completar esa verificación.

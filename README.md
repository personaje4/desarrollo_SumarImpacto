# SumarImpacto segunda entrega

Aplicación de gestión de proyectos y donantes corporativos con Express y vistas Pug.

## Avance actual

Se preparó y verificó la conexión a MongoDB mediante Mongoose. El servidor espera esa conexión antes de aceptar solicitudes. Los controladores todavía guardan información en JSON: la migración de los módulos está pendiente.

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

Esquemas Mongoose, migración de controladores, validaciones, adaptación de vistas y referencias, pruebas funcionales y documentación final. Consultar DIAGNOSTICO_TP2.md para el análisis de la primera entrega.

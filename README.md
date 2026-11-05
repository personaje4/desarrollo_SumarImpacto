# SumarImpacto — Tercera entrega en desarrollo

Grupo 4 · Jueves 19:15 hs · 2.º B · IFTS 29

Base de trabajo derivada del ZIP de la segunda entrega. Versión de preparación: `3.0.0-dev.1`. Gestiona Proyecto y Donante Corporativo con Node.js, Express, Pug y MongoDB/Mongoose.

## Estado actual

El CRUD y las validaciones de V2 se conservan. Esta primera etapa incorpora instrucciones para Atlas y un comando de comprobación de conexión. Angel verificó la conexión, el alta de un proyecto y un donante vinculado, y la persistencia tras reiniciar la aplicación. Ver el [registro de pruebas](docs/VERIFICACION_ETAPA_1.md#verificación-manual-en-atlas). Quedan pendientes autenticación, autorización, middlewares, vistas y despliegue.

## Instalación y ejecución

Requisito de esta copia: Node.js 24 y npm. Desde la carpeta que contiene package.json:

```powershell
npm ci
Copy-Item .env.example .env
```

Crear `.env` solo si no existe; si existe, editarlo. Para MongoDB local, iniciar el servicio y usar:

```text
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/sumarimpacto
```

Para Atlas seguir [la guía desde cero](docs/ATLAS_PASO_A_PASO.md). Reemplazar MONGODB_URI dentro de `.env` con la cadena real y mantener una sola línea activa. El cambio de URI permite usar Atlas con los modelos existentes. No publicar `.env` ni copiar credenciales a documentación.

```powershell
npm run db:check
npm start
```

`db:check` conecta, realiza ping y desconecta sin modificar documentos. El servidor abre HTTP después de conectar a la base. Abrir http://localhost:3000 si se mantiene PORT=3000. `npm run dev` inicia con vigilancia de cambios.

## Archivos y responsabilidades

| Archivo o carpeta | Responsabilidad |
|---|---|
| index.js | Express, Pug, rutas y arranque después de conectar. |
| config/database.js | Conexión Mongoose usando MONGODB_URI. |
| models/ | Esquemas Proyecto y Donante Corporativo. |
| controllers/ y routes/ | CRUD, validaciones y respuestas HTML/JSON. |
| views/ | Formularios y listados Pug. |
| scripts/comprobarConexion.js | Ping y cierre de conexión sin escritura. |
| tests/ | Pruebas locales y de integración existentes. |
| data/ y scripts/migrarDonantes.js | Ejemplos e importación optativa, no carga automática. |
| docs/ | Guía Atlas, preparación y verificaciones de TP3, documentación histórica. |

Se conservan CommonJS, async/await y MVC de la segunda entrega. No se agregan dependencias; se utilizan Express, Mongoose, Pug y dotenv ya declarados y node:test incluido en Node.js.

## API y modelo de datos

Ambos módulos mantienen GET de listado y consulta, POST de alta, PUT de actualización y DELETE de baja:

| Base | Consulta y escritura individual |
|---|---|
| /proyecto | /proyecto/:idProyecto |
| /donanteCorporativo | /donanteCorporativo/:idDonante |

Para usar JSON desde Postman enviar `Accept: application/json` y, en escrituras JSON, `Content-Type: application/json`. Se mantienen los códigos 200, 201, 400, 404, 409 y 500 del CRUD y las redirecciones 302 de formularios.

Los campos, esquemas, relación donante–proyecto, cuerpos y ejemplos completos se conservan en [la documentación de V2](docs/README_SEGUNDA_ENTREGA.md#modelo-de-datos). Sus comandos iniciales de descarga y resultados anteriores corresponden a V2; para instalar esta copia usar las instrucciones de este README. El control de acceso cambiará estas rutas en una etapa posterior.

## Verificación

```powershell
npm test
```

Estas pruebas validan modelos, Pug y algunas respuestas HTTP con consultas simuladas; no prueban persistencia real. Las suites de integración existentes borran datos: ejecutarlas únicamente en una base descartable cuyo nombre termine en `_test`, una suite por vez:

```powershell
$env:MONGODB_URI_TEST="mongodb://127.0.0.1:27017/sumarimpacto_tp3_test"
node --test tests/donante.integration.test.js
node --test tests/proyecto.integration.test.js
```

No usar la base de demostración como base de pruebas. Ver [registro de verificación de esta etapa](docs/VERIFICACION_ETAPA_1.md) para resultados ejecutados y límites. No sumar los conteos de ejecuciones repetidas como casos nuevos.

## Reparto y próximos pasos

- Angel: Atlas, integración y posterior despliegue.
- Adriana: acceso, permisos y Proyecto.
- David: errores, middlewares y Donante Corporativo.
- Gastón: vistas, pruebas de recorrido y coordinación de video.

Cada autor prueba y documenta su parte. Ver [alcance de la primera etapa](docs/ETAPA_1_ANGEL.md). Confirmar con el equipo el mecanismo de acceso y permisos antes de integrar.

## Referencias

D3 sección 7 (async/await), D6 secciones 5, 6, 8.2, 9 y 11 (Express, middlewares, Pug, errores y MVC), D8 secciones 8, 13 y 14 (relaciones y Mongoose); consigna final de tercera entrega. Para Atlas, fuentes oficiales enlazadas en su guía. Los documentos DIAGNOSTICO_TP2 e INTEGRACION_* del ZIP son antecedentes de la segunda entrega.

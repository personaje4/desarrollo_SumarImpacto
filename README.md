# SumarImpacto — Tercera entrega

Grupo 4 · Jueves 19:15 hs · 2.º B · IFTS 29

Base de trabajo derivada del ZIP de la segunda entrega. Versión de preparación: `3.0.0-dev.1`. Gestiona Proyecto y Donante Corporativo con Node.js, Express, Pug y MongoDB/Mongoose.

## Enlaces de entrega

- [Aplicación en Render](https://desarrollo-sumarimpacto.onrender.com)
- [Documentación de la tercera entrega](https://docs.google.com/document/d/1f9CIgAJAp75VIhv1TVGNSH6jajAi6i5M/edit)
- [Registro de aportes](https://docs.google.com/document/d/1Sb5d1UG5oE3vrbptqJOQGk1BTKLplSkl/edit)
- [Video grupal de la carpeta de la oficina](https://drive.google.com/file/d/1e_4SEgCWKAJUT_DGMhyKnqFwY9Y21oFL/view?usp=sharing)

## Funcionalidades de la tercera entrega

- El administrador puede consultar y gestionar proyectos y donantes corporativos. Ambos listados incluyen acciones por fila y la opción **Eliminar por ID** debajo de la tabla.
- El donante corporativo con rol lector puede consultar **Mis donaciones** y acceder únicamente a su proyecto asignado. El equipo ratificó este alcance el 13 de noviembre de 2026 por **4 votos a 0**.
- Una cuenta lectora sin donante vinculado recibe un aviso web con instrucciones y un enlace para volver al inicio. La API conserva la respuesta JSON con estado `403`.
- Los formularios y listados tienen un espaciado más compacto. Los listados muestran el ID MongoDB y ocultan el número interno del proyecto y el ID histórico del donante.

La mejora del aviso quedó en el commit `8f99411`. Las figuras 13 a 15 de la documentación de entrega muestran el registro y el acceso con una cuenta lectora sin vínculo en Render.

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
| /donantes-corporativos | /donantes-corporativos/:idDonante |

Para usar JSON desde Postman enviar `Accept: application/json` y, en escrituras JSON, `Content-Type: application/json`. Se mantienen los códigos 200, 201, 400, 404, 409 y 500 del CRUD y las redirecciones 302 de formularios.

Los campos, esquemas, relación donante–proyecto, cuerpos y ejemplos completos se conservan en [la documentación de V2](docs/README_SEGUNDA_ENTREGA.md#modelo-de-datos). Sus comandos iniciales de descarga y resultados anteriores corresponden a V2; para instalar esta copia usar las instrucciones de este README. Las rutas de proyectos y donantes requieren iniciar sesión. Las operaciones de alta, edición y baja están reservadas al administrador.

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

## Distribución de tareas

- Angel: Atlas, despliegue, integración y preparación de la entrega.
- Adriana: acceso, permisos y Proyecto.
- David: errores, middlewares y Donante Corporativo.
- Gastón: vistas, pruebas de recorrido y coordinación de video.

Cada autor prueba y documenta su parte. Ver [alcance de la primera etapa](docs/ETAPA_1_ANGEL.md). Los aportes y sus evidencias están registrados en el documento de entrega.

## Referencias

D3 sección 7 (async/await), D6 secciones 5, 6, 8.2, 9 y 11 (Express, middlewares, Pug, errores y MVC), D8 secciones 8, 13 y 14 (relaciones y Mongoose); consigna final de tercera entrega. Para Atlas, fuentes oficiales enlazadas en su guía. Los documentos DIAGNOSTICO_TP2 e INTEGRACION_* del ZIP son antecedentes de la segunda entrega.

## Despliegue y prueba manual de roles

- [Aplicación en Render](https://desarrollo-sumarimpacto.onrender.com)
- Despliegue inicial documentado en Render desde `integracion-tp3`, commit `45069df`, con MongoDB Atlas.
- Prueba manual realizada el 12 de noviembre de 2026.

| Rol | Resultado observado |
|---|---|
| Lector | Inició sesión y consultó el proyecto «Prueba Atlas» y su donante vinculado. El listado no mostró acciones de alta, edición ni baja. |
| Administrador | Inició sesión y vio las opciones para registrar, editar y eliminar proyectos. |

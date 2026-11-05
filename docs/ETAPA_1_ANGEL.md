# Primera etapa de Angel

## Objetivo y alcance

Preparar una copia independiente de la segunda entrega para trabajar en TP3 y comprobar su comportamiento antes de integrar cambios. Esta etapa prepara Atlas; no implementa el acceso de Adriana, los middlewares de David ni las vistas de Gastón.

## Base recibida

Archivo original: `desarrollo_SumarImpacto_V2.0.zip`, conservado sin modificar en Descargas. La copia de trabajo está en `trabajo/SumarImpacto_TP3`. El ZIP no incluye historial de Git, así que no se atribuye a esta copia un commit comprobado. El README original quedó en `docs/README_SEGUNDA_ENTREGA.md`; sus resultados son antecedentes históricos.

## Cambios preparados

- Nombre de paquete `sumarimpacto` y versión `3.0.0-dev.1`, que identifica desarrollo en curso. Dependencias conservadas; metadatos de package-lock coherentes.
- `npm test`: ejecuta las dos suites locales existentes; no requiere una base real.
- `npm run db:check`: comprueba conexión y ping sin escribir datos y cierra Mongoose incluso si falla. No imprime URI ni errores con posibles credenciales.
- `.env.example`: explica las alternativas local y Atlas. `.gitignore` conserva el ejemplo y excluye configuraciones privadas.
- `docs/ATLAS_PASO_A_PASO.md`: cuenta, instancia, usuario, acceso de red, configuración y pasos de comprobación.

`config/database.js` ya recibe `MONGODB_URI`, espera `mongoose.connect` y limita la selección de servidor a cinco segundos. `index.js` ya conecta antes de abrir HTTP y admite `PORT`. Se conserva esa implementación; no hace falta reescribir modelos para cambiar de servidor MongoDB.

## Criterios para cerrar las próximas etapas

1. Atlas: conexión, alta, consulta y persistencia verificadas. Ver el [registro de resultados](VERIFICACION_ETAPA_1.md#verificación-manual-en-atlas).
2. Trabajo del equipo: compartir esta base; acordar acceso y permisos; integrar los aportes de cada integrante.
3. Despliegue: elegir alojamiento, configurar entorno, probar la URL y repetir el recorrido con permisos y errores integrados. El ping no sustituye estas pruebas.

## Para explicar en la defensa

Diferencia entre MongoDB local y Atlas; qué contiene MONGODB_URI; diferencia entre usuario de Atlas, usuario de base y usuario de la aplicación; por qué no se sube `.env`; qué prueba un ping y qué requiere una prueba CRUD; por qué el servidor espera la conexión a la base.

## Registro de asistencia

Preparación y verificaciones realizadas con asistencia de Codex. Angel debe revisar el código, reproducir los pasos y registrar su intervención real antes de trasladar estos cambios al registro grupal de aportes. No se atribuyen estos cambios como trabajo manual ya realizado por Angel.

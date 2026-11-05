# Configurar MongoDB Atlas desde cero

Esta guía corresponde a la primera etapa de Angel. Conexión y persistencia verificadas el 05/11/2026. La aplicación todavía no tiene autenticación de usuarios: el usuario de base de datos explicado aquí es diferente del usuario de la aplicación que desarrollará Adriana.

## 1. Crear cuenta, proyecto e instancia

1. Ingresar a https://www.mongodb.com/atlas y crear tu cuenta.
2. Crear un proyecto de Atlas para SumarImpacto.
3. Crear una instancia o cluster. Revisar las condiciones y elegir la opción gratuita si está disponible para tu cuenta. No confirmar una contratación paga para esta práctica sin decidirlo antes.
4. Esperar a que termine su preparación. Los nombres y la ubicación de los botones pueden cambiar.

## 2. Crear usuario y permitir la conexión

1. En la administración de acceso a la base, crear un **usuario de base de datos** con contraseña. No es lo mismo que la cuenta con la que ingresás a Atlas.
2. Conceder lectura y escritura sobre la base `sumarimpacto`, sin privilegios de administración del proyecto.
3. En la lista de acceso de red del proyecto, agregar la IP pública actual de tu computadora. Si cambia, actualizar la entrada.
4. Al publicar, configurar también el acceso para la salida de red del alojamiento elegido. Ese paso todavía está pendiente; no requiere publicar la URI.

## 3. Obtener la cadena para Node.js

1. Abrir la opción de conexión de la instancia y elegir **Drivers**, con Node.js.
2. Copiar la cadena ofrecida por Atlas. Conservar el host y las opciones que muestre tu instancia.
3. Reemplazar usuario y contraseña por los del usuario de base. Si la contraseña contiene caracteres reservados de una URL, codificarla para ese componente; no codificar la URI completa. No usar un sitio externo para procesar la contraseña.
4. Indicar el nombre de base `/sumarimpacto` antes de `?`, conservando las opciones de Atlas. No dejar marcadores como `<password>`.

La aplicación usa Mongoose, que ya incluye su driver: no hace falta agregar otra dependencia para este paso.

## 4. Configurar y comprobar

Desde la carpeta del proyecto, en PowerShell:

```powershell
Copy-Item .env.example .env
```

Si `.env` ya existe, editarlo y conservar la configuración necesaria; no sobrescribirlo. Dentro de ese archivo dejar una sola línea activa `MONGODB_URI` con la cadena real. No pegarla en el chat, en Drive, en capturas ni en el repositorio.

```powershell
npm run db:check
```

El comando abre la conexión, ejecuta `ping` y la cierra. No crea ni elimina documentos. Una respuesta correcta prueba conectividad; no demuestra el CRUD ni la persistencia de los módulos.

Después:

```powershell
npm start
```

Abrir http://localhost:3000. Para demostrar persistencia en Atlas, crear un proyecto de ejemplo y un donante vinculado, anotar sus identificadores, detener y volver a iniciar la aplicación y comprobar que ambos continúan disponibles. Guardar resultados reales y evidencias sin mostrar credenciales. Consultar el [resultado y las capturas](VERIFICACION_ETAPA_1.md#verificación-manual-en-atlas).

## 5. Si la conexión falla

- Comprobar que la instancia esté disponible y que la IP actual esté autorizada.
- Verificar el usuario de base y su contraseña, no las credenciales de la cuenta de Atlas.
- Comprobar el host real, el nombre de base y la codificación de la contraseña.
- Revisar la conectividad de red y DNS de la computadora.
- El proyecto limita la selección de servidor a cinco segundos. Un error dentro de ese plazo no identifica por sí solo la causa.

## Evidencia que debe completar Angel

Prueba manual realizada el 05/11/2026. Se verificaron el ping, el alta, la consulta y la persistencia del vínculo en Atlas. Queda pendiente el despliegue público.

## Fundamento

- D3, sección 7: async/await; D8, secciones 13 y 14: Mongoose. La separación de configuración y el arranque previo al servidor ya existían en V2.
- La consigna final solicita MongoDB Atlas y despliegue; el alojamiento se elegirá en una etapa posterior.
- Documentación oficial consultada el 04/11/2026: [Conectar una instancia de Atlas](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/) y [Conexión mediante drivers](https://www.mongodb.com/docs/atlas/driver-connection/). Verificar las condiciones de las opciones ofrecidas por tu cuenta al crear la instancia.

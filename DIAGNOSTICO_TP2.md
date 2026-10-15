# SumarImpacto segunda entrega

> Diagnóstico histórico de la primera entrega. Para el estado de la integración de Proyecto del 15/10/2026, consultar README.md e INTEGRACION_PROYECTO.md.

## Estado de la primera etapa

Se revisaron los archivos del ZIP de la primera entrega y se preparó esta copia de trabajo. El ZIP original y los materiales de sources no fueron modificados. La revisión fue estática: todavía no se ejecutó la aplicación ni se probó una conexión a MongoDB.

## Alcance

La consigna general exige Node.js, Express, MongoDB con Mongoose, organización modular, rutas, controladores, middlewares, manejo de errores, validaciones simples, async/await y documentación. El cronograma del Grupo 4 delimita los módulos Proyecto y Donante Corporativo, con vistas Pug y pruebas CRUD y de persistencia. No se agregan módulos nuevos.

## Estructura actual

- index.js configura Express, JSON, formularios, Pug y las rutas. Inicia en el puerto 3000.
- routes contiene las rutas de ambos módulos. Hay consultas, altas, modificaciones por PUT y eliminaciones; también formularios para altas y bajas.
- controllers lee y escribe JSON con operaciones síncronas de fs.
- models contiene clases JavaScript. ProyectoManager duplica lectura y escritura que ya hacen los controladores y no es utilizado por ellos.
- views contiene las plantillas Pug. No hay formularios de edición; la modificación está disponible por API.
- data contiene tres proyectos y tres donantes de ejemplo. Los tres donantes referencian proyectos presentes.
- package.json declara Express, Pug y Nodemon. No declara Mongoose; solo incluye el comando dev.

## Hallazgos y correcciones previstas

1. No existe persistencia MongoDB. Reemplazar la lectura y escritura JSON por modelos Mongoose y operaciones con async/await.
2. Las validaciones HTML no protegen la API. Agregar validación en el servidor para campos requeridos, números, fechas, correos e identificadores.
3. Los proyectos guardados usan estados «En ejecución», «Planificación» y «Finalizado»; el formulario usa pendiente, activo, finalizado y cancelado. Los donantes guardados usan mayúsculas y el formulario minúsculas. Definir una convención y documentar la equivalencia antes de importar datos.
4. Dos proyectos tienen fechaFin con un espacio; el formulario exige esa fecha. Resolver si puede quedar sin definir. Una fecha no informada no debe convertirse en una fecha inválida.
5. El CUIT guardado incluye guiones, pero el formulario admite como máximo 11 caracteres. Unificar el formato y validar una entrada consistente. La validación fiscal del dígito verificador no surge como requisito docente.
6. proyectoAsignadoId se convierte a número sin verificar que exista el proyecto. Comprobar la referencia al crear o modificar un donante. Definir qué sucede al eliminar un proyecto vinculado.
7. Los IDs se calculan como máximo más uno y se aceptan IDs proporcionados por el cliente sin verificar duplicados. Elegir y aplicar una estrategia coherente para MongoDB y las vistas. No mezclar IDs numéricos con ObjectId sin una conversión documentada.
8. req.accepts('html') también puede resultar verdadero para solicitudes que aceptan cualquier formato. Para pruebas JSON con el código actual debe enviarse Accept: application/json. Revisar la negociación de respuesta para evitar redirecciones inesperadas.
9. No hay middleware propio para errores ni respuesta general para rutas inexistentes. Incorporar manejo de errores consistente y diferenciar datos inválidos, registros inexistentes y fallos internos.

## Plan y criterios de finalización

1. Revisar requisitos y datos: diagnóstico realizado; quedan por definir las reglas indicadas abajo.
2. Conexión y modelos: configurar la URI sin credenciales públicas, conectar antes de escuchar solicitudes y definir esquemas coherentes con los campos existentes.
3. Controladores y vistas: eliminar el acceso JSON del funcionamiento habitual, completar CRUD asincrónico y adaptar identificadores, referencias y fechas en Pug.
4. Pruebas: verificar CRUD de ambos módulos, entradas inválidas, identificadores inexistentes, referencias y persistencia después del reinicio. Registrar entrada, resultado esperado, resultado obtenido y evidencia real.
5. Documentación: README reproducible, endpoints, modelo de datos, responsabilidades reales, bibliografía y guion del video. Preparar el PDF y los enlaces finales cuando las pruebas estén terminadas.

## Fundamentos de la cursada

- D3, sección 7 ASYNC/AWAIT: operaciones asincrónicas.
- D6, secciones 5, 6, 8.2, 9 y 11: routers, middlewares, Pug, errores y MVC.
- D7, secciones 6 y 7: REST y pruebas con Postman.
- D8, páginas 62 a 66, Mongoose, Instalación y Esquemas: conexión, esquemas, modelos y tipos de datos.

## Información pendiente

- Reglas funcionales originales de ambos módulos, si existe una especificación adicional.
- Uso de MongoDB local o Atlas.
- Estrategia de identificadores y necesidad de conservar los números actuales.
- Estados permitidos, obligatoriedad de fechaFin y política para proyectos con donantes vinculados.
- Identificación del estudiante y aportes efectivamente realizados por cada integrante.

## Pruebas y defensa oral

No se ejecutaron pruebas funcionales. La presencia de rutas CRUD no demuestra que los casos normales e inválidos funcionen correctamente.

Cada integrante debe poder explicar el recorrido solicitud → ruta → controlador → modelo → MongoDB → respuesta o vista; por qué se usan async/await; cómo se validan los datos; cómo se trata una referencia a un proyecto; y qué evidencia demuestra la persistencia.

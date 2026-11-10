// middlewares/errorMiddleware.js

// 1. Captura de JSON mal formado en el body (SyntaxError de express.json)
const capturarJsonInvalido = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            mensaje: 'JSON inválido en el cuerpo de la solicitud' 
        });
    }
    next(err);
};

// 2. Middleware para rutas no encontradas (404)
const rutaNoEncontrada = (req, res, next) => {
    const esApi = req.is('application/json') || req.headers.accept?.includes('application/json');
    if (esApi) {
        return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }
    res.status(404).render('error', {
        titulo: 'Página no encontrada (404)',
        mensaje: 'La ruta solicitada no existe o fue movida.'
    });
};

// 3. Manejador centralizado de errores
const manejadorErrores = (err, req, res, next) => {
    // Clave duplicada en Mongo (ej: CUIT duplicado o idProyecto repetido)
    if (err.code === 11000) {
        const campo = Object.keys(err.keyPattern || {})[0] || 'campo';
        return res.status(409).json({
            mensaje: `Ya existe un registro con ese ${campo}`
        });
    }

    // Errores de validación o casteo de Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({ mensaje: err.message });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ mensaje: 'Identificador con formato inválido' });
    }

    const status = err.status || 500;

    // Log interno en el servidor sin exponerlo al cliente
    if (status === 500) {
        console.error('Error interno capturado:', err);
    }

    // Mensaje seguro sin stack traces
    const mensajeRespuesta = status === 500 
        ? 'Error interno del servidor' 
        : err.message;

    const esApi = req.is('application/json') || req.headers.accept?.includes('application/json');
    if (esApi) {
        return res.status(status).json({ mensaje: mensajeRespuesta });
    }

    return res.status(status).render('error', {
        titulo: `Error ${status}`,
        mensaje: mensajeRespuesta
    });
};

module.exports = {
    capturarJsonInvalido,
    rutaNoEncontrada,
    manejadorErrores
};
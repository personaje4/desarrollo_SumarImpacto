const fs = require('fs');
const path = require('path');

const rutaArchivoDonanteCorporativo = path.join(__dirname, '../data/donanteCorporativo.json');

// Función leer archivo
const leerDonanteCorporativo = () => {
    const data = fs.readFileSync(rutaArchivoDonanteCorporativo, 'utf8');
    return JSON.parse(data);
};

// Función guardar archivo
const guardarDonanteCorporativo = (donantes) => {
    fs.writeFileSync(
        rutaArchivoDonanteCorporativo,    
        JSON.stringify(donantes, null, 2)
    );
};

// GET ALL
const obtenerDonanteCorporativo = (req, res) => {
    const donantes = leerDonanteCorporativo();

    if (req.accepts('html')) {
        return res.render('donantes/listar', { donantes });
    }

    res.json(donantes); 
};

// GET BY ID
const obtenerDonanteCorporativoPorId = (req, res) => {
    const donantes = leerDonanteCorporativo();
    const id = parseInt(req.params.idDonante || req.params.idDonanteCorporativo, 10);
    const donante = donantes.find((d) => d.id === id || d.idDonanteCorporativo === id);  

    if (!donante) {
        return res.status(404).json({ message: 'Donante corporativo no encontrado' });
    }
    res.json(donante);  
};

// CREATE (Secuencia numérica automática)
const crearDonanteCorporativo = (req, res) => {
    const donantes = leerDonanteCorporativo();
    
    const ultimoId = donantes.reduce((max, d) => {
        const idActual = Number(d.id || d.idDonanteCorporativo || 0);
        return idActual > max ? idActual : max;
    }, 0);

    const { idDonanteCorporativo, razonSocial, cuit, rubro, personaContacto, emailContacto, montoTotalDonado, moneda, proyectoAsignadoId, estado } = req.body;
    
    const nuevoDonante = {
        idDonanteCorporativo: idDonanteCorporativo ? Number(idDonanteCorporativo) : ultimoId + 1,
        razonSocial,
        cuit,
        rubro,
        personaContacto,
        emailContacto,
        montoTotalDonado,
        moneda,
        proyectoAsignadoId,
        estado: estado || 'activo'
    };

    donantes.push(nuevoDonante); 
    guardarDonanteCorporativo(donantes);

    if (req.accepts('html')) {
        return res.redirect('/donanteCorporativo');
    }

    res.status(201).json({
        mensaje: 'Donante corporativo creado',
        donante: nuevoDonante  
    });
};

// UPDATE
const actualizarDonanteCorporativo = (req, res) => {
    const donantes = leerDonanteCorporativo();
    const id = parseInt(req.params.idDonante || req.params.idDonanteCorporativo, 10);
    const donanteIndex = donantes.findIndex((d) => d.id === id || d.idDonanteCorporativo === id);    

    if (donanteIndex === -1) {
        return res.status(404).json({ 
            mensaje: 'Donante corporativo no encontrado' 
        });
    }

    const donante = donantes[donanteIndex];
    const { idDonanteCorporativo, razonSocial, cuit, rubro, personaContacto, emailContacto, montoTotalDonado, moneda, proyectoAsignadoId, estado } = req.body;
    
    donante.idDonanteCorporativo = idDonanteCorporativo ?? donante.idDonanteCorporativo;
    donante.razonSocial = razonSocial ?? donante.razonSocial;
    donante.cuit = cuit ?? donante.cuit;
    donante.rubro = rubro ?? donante.rubro;
    donante.personaContacto = personaContacto ?? donante.personaContacto;
    donante.emailContacto = emailContacto ?? donante.emailContacto;
    donante.montoTotalDonado = montoTotalDonado ?? donante.montoTotalDonado;
    donante.moneda = moneda ?? donante.moneda;
    donante.proyectoAsignadoId = proyectoAsignadoId ?? donante.proyectoAsignadoId;
    donante.estado = estado ?? donante.estado;

    guardarDonanteCorporativo(donantes);
    res.json({ 
        mensaje: 'Donante corporativo actualizado', 
        donante 
    });
};

// DELETE (Soporta web y API)
const eliminarDonanteCorporativo = (req, res) => {
    const donantes = leerDonanteCorporativo();
    const id = parseInt(req.params.idDonante || req.params.idDonanteCorporativo, 10);
    const nuevosDonantes = donantes.filter((d) => (d.id !== id && d.idDonanteCorporativo !== id));

    if (donantes.length === nuevosDonantes.length) {
        if (req.accepts('html')) {
            return res.status(404).send("Error: Donante no encontrado. <a href='/donanteCorporativo'>Volver</a>");
        }
        return res.status(404).json({ mensaje: 'Donante corporativo no encontrado' });
    }

    guardarDonanteCorporativo(nuevosDonantes);

    if (req.accepts('html')) {
        return res.redirect('/donanteCorporativo');
    }

    res.json({ mensaje: 'Donante corporativo eliminado' });
};

module.exports = {
    obtenerDonanteCorporativo,
    obtenerDonanteCorporativoPorId,
    crearDonanteCorporativo,
    actualizarDonanteCorporativo,
    eliminarDonanteCorporativo
};
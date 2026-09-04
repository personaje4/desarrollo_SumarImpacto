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
    res.json(donantes); 
};

// GET BY ID
const obtenerDonanteCorporativoPorId = (req, res) => {
    const donantes = leerDonanteCorporativo();
    const id = parseInt(req.params.idDonante, 10);
    const donante = donantes.find((d) => d.id === id || d.idDonante === id);  

    if (!donante) {
        return res.status(404).json({ message: 'Donante corporativo no encontrado' });
    }
    res.json(donante);  
};

// CREATE
const crearDonanteCorporativo = (req, res) => {
    const donantes = leerDonanteCorporativo();
    const { idDonante, razonSocial, cuit, rubro, personaContacto, emailContacto, montoTotalDonado, moneda, proyectoAsignadoId, estado } = req.body;
    
    const nuevoDonante = {
        idDonante: idDonante || Date.now(),
        razonSocial,
        cuit,
        rubro,
        personaContacto,
        emailContacto,
        montoTotalDonado,
        moneda,
        proyectoAsignadoId,
        estado
    };

    donantes.push(nuevoDonante); 
    guardarDonanteCorporativo(donantes);
    res.status(201).json({
        mensaje: 'Donante corporativo creado',
        donante: nuevoDonante  
    });
};

// UPDATE
const actualizarDonanteCorporativo = (req, res) => {
    const donantes = leerDonanteCorporativo();
    const id = parseInt(req.params.idDonante, 10);
    const donanteIndex = donantes.findIndex((d) => d.id === id || d.idDonante === id);    

    if (donanteIndex === -1) {
        return res.status(404).json({ 
            mensaje: 'Donante corporativo no encontrado' 
        });
    }

    const donante = donantes[donanteIndex];
    const { idDonante, razonSocial, cuit, rubro, personaContacto, emailContacto, montoTotalDonado, moneda, proyectoAsignadoId, estado } = req.body;
    
    donante.idDonante = idDonante ?? donante.idDonante;
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

// DELETE
const eliminarDonanteCorporativo = (req, res) => {
    const donantes = leerDonanteCorporativo();
    const id = parseInt(req.params.idDonante, 10);
    const nuevosDonantes = donantes.filter((d) => d.id !== id && d.idDonante !== id);

    if (donantes.length === nuevosDonantes.length) {
        return res.status(404).json({ 
            mensaje: 'Donante corporativo no encontrado' 
        });
    }

    guardarDonanteCorporativo(nuevosDonantes);
    res.json({ 
        mensaje: 'Donante corporativo eliminado'
    });
};

module.exports = {
    obtenerDonanteCorporativo,
    obtenerDonanteCorporativoPorId,
    crearDonanteCorporativo,
    actualizarDonanteCorporativo,
    eliminarDonanteCorporativo
};
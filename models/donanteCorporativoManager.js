class DonanteCorporativo {
    constructor(idDonanteCorporativo,razonSocial, cuit, rubro, personaContacto, emailContacto, montoTotalDonado, moneda, proyectoAsignadoId, estado) {
        this.idDonanteCorporativo = idDonanteCorporativo;
        this.razonSocial = razonSocial;
        this.cuit = cuit;
        this.rubro = rubro;
        this.personaContacto = personaContacto;
        this.emailContacto = emailContacto;
        this.montoTotalDonado = montoTotalDonado;
        this.moneda = moneda;
        this.proyectoAsignadoId = proyectoAsignadoId;
        this.estado = estado;
    }
}
module.exports = DonanteCorporativo;
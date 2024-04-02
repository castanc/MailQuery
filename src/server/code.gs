function getAll()
{
  midineroTransferencias();
  midineroRetiros();
  midineroConsumos();
  midineroRecargas();
  midineroRechazos();
  bancolombiaCompras();
}


function midineroTransferencias() {


  let sheetName = "transferencias";
  let folderName = "midinero";
  let kind = "DB";
  let query = 'in:inbox FROM:MIDINERO subject:"transferencia"';


  let triggers = ["Enviada", "Nº de referencia", "Producto origen", "Cuenta origen",
    "Nombre origen", "Producto destino", "Cuenta destino", "Institución destino", "Nombre destino", "Moneda", "Total Pesos", "Total Dólares", "Concepto", "Observaciones", "Nº boleto BCU"];

  queryGmail(sheetName, query, triggers, folderName, kind);

}



function midineroRetiros() {
  let query = 'in:inbox FROM:MIDINERO subject:"Aviso retiro por"';

  let sheetName = "retiros";
  let folderName = "midinero";
  let kind = "DB";

  let triggers = ["Fecha y hora", "Comercio", "Producto", "Nº cuenta", "Nº autorización", "Moneda", "Total Pesos", "Total Dólares"];

  queryGmail(sheetName, query, triggers, folderName, kind);

}


function midineroConsumos() {
  let query = 'in:inbox FROM:MIDINERO subject:"Aviso consumo por"';

  let sheetName = "consumos";
  let folderName = "midinero";
  let kind = "DB";

  let triggers = ["Fecha y hora", "Comercio", "Medio de pago", "Nº cuenta", "Nº autorización", "Moneda", "Total Pesos", "Total Dólares"];

  queryGmail(sheetName, query, triggers, folderName, kind);

}


function midineroRecargas() {
  let query = 'in:inbox FROM:MIDINERO subject:"Aviso recarga por"';

  let sheetName = "recargas";
  let folderName = "midinero";
  let kind = "CR";

  let triggers = ["Fecha y hora", "Producto", "Cuenta", "Nº autorización", "Moneda", "Total Pesos", "Total Dólares"];

  queryGmail(sheetName, query, triggers, folderName, kind);

}
function midineroRechazos() {
  let query = 'in:inbox FROM:MIDINERO subject:"Aviso rechazo consumo por" after:2024/04/01';

  let sheetName = "rechazos";
  let folderName = "midinero";
  let kind = "RECHAZO";

  let triggers = ["Fecha y hora", "Comercio", "Medio de pago", "Nº cuenta", "Monto", "Motivo", "Moneda", "Total Pesos", "Total Dólares"];

  queryGmail(sheetName, query, triggers, folderName, kind);

}



function bancolombiaCompras() {
  let query = 'in:inbox "Notificación Transaccional"';
  let triggers = ["Fecha Trans", "Entidad", "Valor COP$", "Comercio", "Tarjeta", "Valor Original"];


  let sheetName = "bancolombia-compras";
  let folderName = "bancolombia";
  let kind = "DB";
  queryGmailFlat(triggers, sheetName, query, folderName, kind);
  
}

function movsBancolombiaNomina(){
  let query = 'in:inbox "le informa un pago de "';
  let triggers = ["Fecha", "Entidad", "Detalle", "Valor $"];

  let sheetName = "bancolombia-nomina";
  let folderName = "bancolombia";
  let kind = "CR";
  queryGmailFlat2(triggers, sheetName, query, folderName, kind);

}







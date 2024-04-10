
/*
Parameters for a more generic function:
Headers array: 
{
  DisplayName
  InternalName
  SingleValueInLine
  IsMoney
  IsDate
  IsNumber
  IsText
  Position
}

set derfinition:
title
subject trigger
query
TranType
LineSeparated
MasterInsitution
date start for the format
date end for the format
*/

function movBancolombia(plainBody, kind, dt, subject) {
  let val = "";
  let parts = [];


  let row = [];
  let start = "Bancolombia le informa Compra por ";
  let end = ". Inquietudes";

  //Bancolombia le informa Compra por $13.973,49 en DISCO 13 11:39. 01/04/2024 T.Deb *7764. Inquietudes al 6045109095/018000931987.
  let ix = plainBody.indexOf(start);
  if (ix < 0) return row;

  plainBody = plainBody.substr(ix + start.length);
  ix = plainBody.indexOf(end);

  if (ix < 0) return row;

  plainBody = plainBody.substring(0, ix);
  ix = plainBody.indexOf(" ");
  if (ix < 0) return row;

  val = plainBody.substring(1, ix);
  plainBody = plainBody.replace(`$${val} en `, "").trim();
  val = val.replaceAll(".", "").replace(",", ".");

  let comercio = "";
  ix = plainBody.indexOf(":");
  if (ix > 0) {
    comercio = plainBody.substring(0, ix);
    ix = comercio.lastIndexOf(" ");
    if (ix > 0)
      comercio = comercio.substring(0, ix);

  }

  plainBody = plainBody.replace(comercio, "").trim();

  ix = plainBody.indexOf(".");
  let time = plainBody.substr(0, ix).trim();
  plainBody = plainBody.replace(`${time}.`, "").trim();

  let fecha = "";
  ix = plainBody.indexOf("T.Deb");
  if (ix > 0) {
    fecha = plainBody.substr(0, ix).trim();
  }

  let card = "";
  ix = plainBody.indexOf("*");
  if (ix > 0)
    card = plainBody.substring(ix + 1);

  row = [dt, kind, `${fecha} ${time}`, "BANCOLOMBIA", val, comercio, card];

  return row;

}

function bancolombiaNomina(plainBody, kind, dt, subject) {

  //Bancolombia le informa un Pago de Nomina de PROTECCION por $4,620,911.00 en su Cuenta Ahorros. 13:46 22/03/2024. Inquietudes al 018000931987.
  //let triggers = ["Fecha","Entidad","Detalle","Valor $"];

  let val = "";
  let parts = [];


  let row = [];
  let start = "Bancolombia le informa un Pago de ";
  let end = ". Inquietudes";

  let ix = plainBody.indexOf(start);
  if (ix < 0) return row;

  plainBody = plainBody.substr(ix + start.length);
  ix = plainBody.indexOf(end);

  if (ix < 0) return row;
  plainBody = plainBody.substring(0, ix);

  //Pago de PROTECCION por $4,620,911.00 en su Cuenta Ahorros. 13:46 22/03/2024

  let detalle = "";
  ix = plainBody.indexOf(" por $");
  if (ix > 0) {
    detalle = plainBody.substring(0, ix).trim();
    plainBody - plainBody.replaceAll(detalle).trim();
    ix = plainBody.indexOf(" por $");
    if (ix > 0) {
      plainBody = plainBody.substring(ix + 6).trim();
    }
  }

  ix = plainBody.indexOf(" ");
  if (ix > 0) {
    val = plainBody.substring(0, ix).replaceAll(",", "").replace(",", ".");
    plainBody = plainBody.replaceAll(val, "")
  }

  ix = plainBody.indexOf(". ");
  if (ix > 0) {
    plainBody = plainBody.substring(ix + 2).trim();
  }
  parts = plainBody.split(' ');
  let fecha = "";
  if (parts.length == 2) {
    fecha = `${parts[1]} ${parts[0]}`;
  }

  row = [dt, kind, fecha, "BANCOLOMBIA", detalle, val];

  return row;


}


function getMidIneroMovimientos(triggers, lines, kind, dt, subject) {
  let tran = {};
  let val = "";
  let parts = [];
  lines = lines.filter(x => x.trim() != "");

  for (j = 0; j < lines.length; j++) {

    triggers.every((trigger, i) => {
      if (lines[j].trim() == trigger.trim()) {
        j++;
        if (lines[j].indexOf("$") >= 0) {
          parts = lines[j].split(' ');
          if (parts.length >= 2) {
            tran[lines[j - 1]] = parts[1].replaceAll(".", "").replaceAll(",", ".").replaceAll("*", "");
            tran["Moneda"] = parts[0].replaceAll("*", "");
          }
        }
        else {
          val = lines[j].trim().replaceAll("*", "");
          tran[lines[j - 1]] = val;
        }

        return false;
      }
      return true;
    });
  }
  let row = [];
  row.push(dt);
  row.push(kind);
  triggers.forEach(trigger => {
    if (tran[trigger])
      row.push(tran[trigger]);
    else row.push("");
  });

  return row;

}


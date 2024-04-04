function movBancolombia(plainBody, dt, subject) {
    let tran = {};
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
  
    plainBody = plainBody.replace(`${fecha} T.Deb *`, "").trim();
    let card = plainBody;
  
    row = [dt, "DB", "BANCOLOMBIA", val, `${fecha} ${time}`, card];
  
    return row;
  
  }
  
  
  
  
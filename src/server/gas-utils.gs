let lastRow = [];

function getCreateSpreadSheet(folder, fileName, headerRow = "") {
  let file = getFileFromFolder(fileName, folder);
  let header = headerRow.split('\t');
  let spreadSheet = null;
  if (file == null) {
    spreadSheet = SpreadsheetApp.create(fileName);

    var copyFile = DriveApp.getFileById(spreadSheet.getId());
    folder.addFile(copyFile);
    DriveApp.getRootFolder().removeFile(copyFile);
    file = getFileFromFolder(fileName, folder);

  }
  spreadSheet = SpreadsheetApp.openById(file.getId());

  let range = spreadSheet.getDataRange().getValues();
  if (range.length == 1 && range[0].length == 1 && headerRow.length > 0) {
    var sh = spreadSheet.getActiveSheet();
    sh.appendRow(header);
  }



  return spreadSheet;
}

function getLastUpdated(folder, fileName) {
  let file = getFileFromFolder(fileName, folder);
  if (file != null) {
    return DriveApp.getFileById(file.getId()).getLastUpdated();
  }
  return null;

}

function getSpreadSheet(folder, fileName) {
  let file = getFileFromFolder(fileName, folder);
  if (file != null)
    return SpreadsheetApp.openById(file.getId());
  return null;
}



function makeidUpperCase(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}



function getColumnLetter(num) {
  let letters = ''
  while (num >= 0) {
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters
    num = Math.floor(num / 26) - 1
  }
  return letters
}


function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


function addDaysToDate(date, days) {
  let result = date.getDate();
  result.setDate(result.getDate() + days);
  return result;
}

function getCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = null;
  if (folders.hasNext())
    folder = folders.next();
  else
    folder = DriveApp.createFolder(folderName);
  return folder;
}


function getFileFromFolder(name, folder) {
  files = folder.getFilesByName(name);
  if (files.hasNext()) {
    return files.next();
  }
  return null;
}

function getFileLastUpdated(name) {
  let dt = new Date(2000,1,1);
  let files = DriverApp.getFilesByName(name);
  if (files.hasNext()) {
    let file = files.next();
    dt =  DriveApp.getFileById(file.getId()).getLastUpdated();
  }
  dt.setDate(dt.getDate() -1);
  return dt;
}

function getFileLastUpdated(name, folderName) {
  let dt = new Date(2000,1,1);
  let folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    let folder = folders.next();
    let files = folder.getFilesByName(name);
    if (files.hasNext()) {
      let file = files.next();
      dt = DriveApp.getFileById(file.getId()).getLastUpdated();
    }
  }
  dt.setDate(dt.getDate() - 1);
  return  dt;
}


function dateDiff(sd, ed) {
  let d1 = new Date(sd);
  let d2 = new Date(ed);
  let ms = d2.getTime() - d1.getTime();
  return ms / (1000 * 3600 * 24);

  // To calculate the no. of days between two dates
  // let secs = ms / 1000;
  // let hours = ms / (1000 * 3600);
  // let days = ms / (1000 * 3600 * 24);
}


function getTimeStamp(m = null) {
  if (m == null)
    m = new Date();
  return m.toISOString();

}

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




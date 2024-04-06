function readKVPSheet(sheetName, folderName = "", propertyNames = []) {
  let obj = null;
  let folder = null;
  let file;

  if (folderName.length > 0) {
    let folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) folder = folders.next();
    else folder = DriveApp.getRootFolder();

  }
  else folder = DriveApp.getRootFolder();

  if (folder == null) throw (`readKVPSheet() Invalid Folder Name: ${folderName}`);


  let files = folder.getFilesByName(sheetName);
  if (files.hasNext()) file = files.next();

  if (file == null) return obj;

  let grid = [];
  let sheet = SpreadsheetApp.openById(file.getId());
  grid = sheet.getDataRange().getValues();

  if (propertyNames.length == 0)
    propertyNames = grid.map(x => x[0]);

  obj = {};
  for (i = 0; i < grid.length; i++) {
    obj[propertyNames[i]] = grid[i][1];
  }

  return obj;
}

function readSheet(sheetName, folderName = "", colNames = null) {
  let result = [];
  let folder = null;

  if (folderName.length > 0) {
    let folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) folder = folders.next();
    else folder = DriveApp.getRootFolder();

  }
  else folder = DriveApp.getRootFolder();

  let file = null;
  let files = folder.getFilesByName(sheetName);
  if (files.hasNext()) file = files.next();

  let grid = [];

  if (file != null) {
    let sheet = SpreadsheetApp.openById(file.getId());
    grid = sheet.getDataRange().getValues();
  }

  if (colNames == null && grid.length > 0) colNames = grid[0];
  for (i = 1; i < grid.length; i++) {
    let obj = {}
    for (j = 0; j < colNames.length; j++) {
      if (grid[i].length > j) obj[colNames[j]] = grid[i][j];
    }
    result.push(obj);
  }
  return result;
}


function getCreateSpreadSheet(folder, fileName, headerRow = "") {
  let file = getFileFromFolder(fileName, folder);
  let header = headerRow.split('\t');
  let spreadSheet = null;
  if (file == null) {
    spreadSheet = SpreadsheetApp.create(fileName);
    spreadSheet.renameActiveSheet(fileName);

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
  let dt = new Date(2000, 1, 1);
  let files = DriverApp.getFilesByName(name);
  if (files.hasNext()) {
    let file = files.next();
    dt = DriveApp.getFileById(file.getId()).getLastUpdated();
  }
  dt.setDate(dt.getDate() - 1);
  return dt;
}

function getFileLastUpdated(name, folderName) {
  let dt = new Date(2000, 1, 1);
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
  return dt;
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


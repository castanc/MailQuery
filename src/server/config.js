let configFileName = "configuration";
let configFolderName = "personal-records-config";
let processFolderName = "personal-records";

function createConfig() {

  let folder = getCreateFolder(processFolderName);
  let configFolder = getCreateFolder(configFolderName);

  let spreadSheet = SpreadsheetApp.create(configFileName);
  spreadSheet.renameActiveSheet(configFileName);

  var copyFile = DriveApp.getFileById(spreadSheet.getId());
  folder.addFile(copyFile);
  DriveApp.getRootFolder().removeFile(copyFile);
  file = getFileFromFolder(fileName, folder);
  spreadSheet = SpreadsheetApp.openById(file.getId());

  let data = [
    ["JobsSheetName", "personal-records"],
    ["ProcessFolderName", processFolderName],
    ["ConfigFolderName", configFolderName],
    ["BatchId", 0]
  ];
  spreadSheet.appendRow(data);
  return readKVPSheet(configFileName, configFolderName);
}


function incrementBatchId(config) {
  config.BatchId++;
  //todo: update in sheet
  return config;
}

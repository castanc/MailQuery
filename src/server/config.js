let configFileName = "config";
let processFolderName = "personal-records";


function createConfig(configColNames = []) {

  let folder =  getCreateFolder(processFolderName);
  
  let spreadSheet = SpreadsheetApp.create(configFileName);
  spreadSheet.renameActiveSheet(configFileName);

  var copyFile = DriveApp.getFileById(spreadSheet.getId());
  folder.addFile(copyFile);
  DriveApp.getRootFolder().removeFile(copyFile);
  file = getFileFromFolder(configFileName, folder);
  spreadSheet = SpreadsheetApp.openById(file.getId());

  let rows  = [
    ["JobsSheetName", "personal-records"],
    ["ProcessFolderName", processFolderName],
    ["JobsFolderName","personal-records-config"],
    ["ConfigFileName",configFileName]
  ];
  rows.forEach(row=>{
  spreadSheet.appendRow(row);

  })
  let config = readKVPSheet(configFileName, processFolderName, configColNames);
  return config;
}


function incrementBatchId(config) {
  config.BatchId++;
  //todo: update in sheet
  return config;
}

let pageBreak = "";

function mailQuery() {
  
  let config = readKVPSheet(configFileName,configFolderName);
  if  (config == null ) config = createConfig();
  let jobColNames = ["Name", "FolderName","DataKind", "MailFrom", "MailSubject", "DocType", "MainAccount", "MainCard", "MainAccountName", "Function", "RepeatingFieldsHeader", "RepeatingFieldsEnd", "RepeatingFieldsFunction","RepeatingFieldsOffset","Currency1","Currency2","Interest","LateInt","PageBreak","DataStart","DataEnd"]
  

  let fieldsColNames = ["Order", "FieldName", "FieldAlias", "FieldBackPosInLine", "LineOffset", "Mask", "DataType", "Function", "RepeatField"]

  let jobs = readSheet(config.JobsSheetName, config.ConfigFolder, jobColNames);

  jobs.forEach(job => {
    let fieldsFileName = `fields-${job.Name}`;
    let fields = readSheet(fieldsFileName, rootFolder, fieldsColNames);
    let result = monitorGmail(config,job,fields);

  })
}


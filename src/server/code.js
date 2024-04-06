let pageBreak = "";

function mailQuery() {
  let onlyUnread = true;
    let configColNames = ["JobsSheetName","JobsFolderName","ProcessFolderName","ConfigFileName"];

  
  let config = readKVPSheet(configFileName,processFolderName, configColNames);
  if  (config == null ) config = createConfig(configColNames);

  let jobColNames =["Name","TransType","MailFrom","MailSubject","DocType","MainAccount","MainCard","MainAccountName","Function","RepeatingFieldsHeader","RepeatingFieldsEnd","RepeatingFieldsFunction","RepeatingFIeldsOffset","Moneda1","Moneda2","Interest","LateInt","PageBreak","DataStart","DataEnd"]
  
  let fieldsColNames = ["Order", "Name", "FieldAlias", "FieldPosInLine", "LineOffset", "Mask", "DataType", "Separators", "Exclude","Function", "RepeatField","CleanChars","CleanStart","CleanLength"]

  let jobs = readSheet(config.JobsSheetName, config.JobsFolderName, jobColNames);

  jobs.forEach(job => {
    let fieldsFileName = `fields-${job.Name}`;
    let fields = readSheet(fieldsFileName, config.JobsFolderName, fieldsColNames,onlyUnread);
    let result = monitorGmail(config,job,fields);

  })
}


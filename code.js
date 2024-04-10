let onlyUnread = false;

function mailQuery() {
    let configColNames = ["JobsSheetName","JobsFolderName","ProcessFolderName","ConfigFileName"];

  
  let config = readKVPSheet(configFileName,processFolderName, configColNames);
  if  (config == null ) config = createConfig(configColNames);

  let jobColNames =["Name","Active","TransType","MailFrom","MailSubject","DocType","Query","MainAccount","DeleteMail","MainCard","MainAccountName","Function","RepeatingFieldsHeader","RepeatingFieldsEnd","RepeatingFieldsFunction","RepeatingFIeldsOffset","Moneda1","Moneda2","Interest","LateInt","PageBreak","DataStart","DataEnd","RepeatingStartType","RepeatingEndType","MinRepeatingFIelds"];
  
  let fieldsColNames = ["Order", "Name", "FieldAlias", "FieldPosInLine", "LineOffset", "Mask", "DataType", "Separators", "Exclude","Function", "CleanChars","CleanStart","CleanLength"]

  let jobs = readSheet(config.JobsSheetName, config.JobsFolderName, jobColNames);
  jobs = jobs.filter(x=>x.Active == "Y");

  jobs.forEach(job => {
    let fieldsFileName = `fields-${job.Name}`;
    if( job.PageBreak.length == 0) job.PageBreak = pageBreak;
    let fields = readSheet(fieldsFileName, config.JobsFolderName, fieldsColNames,onlyUnread);
    let result = monitorGmail(config,job,fields,onlyUnread);

  })
}


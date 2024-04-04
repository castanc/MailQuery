function monitorMail(config,job, fields, onlyUnread = true, ) {
  let sheet;
  let folder;
  let lines = [];
  let plainBody = "";
  let dt;
  let subject = "";
  let sheetName = `${job.Name}-${job.DocType}`;
  let query = "";
  let ix = 0;
  let i = 0;
  let pages = [];
  let row = [];



  job.BatchId = batchId;
  job.BatchName = batchId.toString();

  let rootFolder = getCreateFolder(config.ProcessFolderName);
  let subfolders = rootFolder.getFoldersByName(job.Name);
  if (subfolders.hasNext()) folder = subfolders.next();
  else folder = rootFolder.createFolder(job.Name);

  let headerFields = fields.filter(x => x.RepeatField == "");
  let repeatFields = fields.filter(x => x.RepeatField != "");
  let fieldNames = headerFields.map(x => x.Name);

  sheet = getCreateSpreadSheet(processFolder, sheetName, `MailDate\tTransKind\tBatchId\t${fieldNames.join('\t')}`);
  
  if (onlyUnread) query = "is:unread ";
  if (job.MailFrom.length > 0) query = `${query}'from:"${job.MailFrom}"'`;
  if (job.MailSubject.length > 0) query = `${query} subject:"${job.MailSubject}"`;


  let dts = getFileLastUpdated(sheetName, job.FolderName);
  query = `${query} after:${dts.getFullYear}/${dts.getMonth + 1}/${dts.getDate()}`;


  const threads = GmailApp.search(query, 0, maxMails);
  threads.forEach((thread) => {
    const messages = thread.getMessages();
    messages.forEach((message) => {
      dt = message.getDate();
      subject = message.getSubject();
      plainBody = message.getPlainBody();
      let attachments = message.getAttachments();

      if (job.DataStart.length > 0) {
        ix = plainBody.indexOf(job, DataStart);
        if (ix >= 0) plainBody = plainBody.sub(ix + job.DataStart.length);
      }
      if (job.DataEnd.length > 0) {
        ix = plainBody.lastIndexOf(job.DataEnd);
        if (ix >= 0) plainBody = plainBody.substring(0, ix);
      }

      let row = processHeaderFields(job, headerFields, plainBody, dt, subject, rootFolder, folder, batchId);
      let repeatingRows = processRepeatingFields(job, headerFields, plainBody, dt, subject, rootFolder, folder, batchId);

      config = incrementBatchId(config);
      

    });
  });
}

function processHeaderFields(job, fields, plainBody, dt, subject, rootFolder, folder, batchId) {
  let ix = 0;
  let row = [dt, job.TransType, batchId];

  if (fields.length == 0) return row;

  ix = plainBody.indexOf(fields[0].Name);
  if (ix >= 0) plainBody = plainBody.substring(ix);
  ix = plainBody.lastIndexOf(fields[fields.length - 1]);
  if (ix >= 0) plainBody = plainBody.substring(0, fields[fields.length - 1].Name.length);

  let lines = plainBody.split('\n');
  row = [dt, job.Name, job.TransType];
  for (i = 0; i < lines.length; i++) {
    fields.every(f => {
      //todo check if requires ==
      if (lines[i] == field.Name) {
        f = getRawData(f, lines[i + field.LineOffset]);
        row.push(f.RawVal);
        return false;
      }
      return true;
    });
    return row;
  }
}

function processRepeatingFields(job, headerFields, plainBody, dt, subject, rootFolder, folder, batchId) {
  let rows = [];
  return rows;

}


function getRawData(field, val) {
  if (field.DataType == "%" || val.includes("%")) {
    val = val.replace("%", "").replace("$", "").trim();
    field.RawVal = Number(val) / 100;
  }
  else if (field.DataType == "M" || val.includes("$")) {
    let parts = val.split(" ");
    if (parts.length >= 2) {
      field.RawVal = Number(parts[1].replaceAll(".", "").replace(",", "."));
      field.Currency = parts[0];
    }
    else {
      field.RawVal = Number(parts[1].replaceAll(".", "").replace(",", ".").replace("$", ""));
      field.Currency = "$";
    }
    return field;
  }
  else if (field.DataType == "D") {
    field.RawvVal = new Date(val);
  }
  else {
    field.RawVal = val.replaceAll("*", "");
    field.DataType = "T";
  }
  return field;
}


function monitorGmail(config, job, fields, onlyUnread = true, maxMails = 500) {
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


  job.DocYear = 0;
  job.DocMonth = 0;
  let rootFolder = getCreateFolder(config.ProcessFolderName);
  let subfolders = rootFolder.getFoldersByName(job.Name);
  if (subfolders.hasNext()) folder = subfolders.next();
  else folder = rootFolder.createFolder(job.Name);

  let headerFields = fields.filter(x => x.RepeatField == "");
  let repeatFields = fields.filter(x => x.RepeatField != "");
  let fieldNames = headerFields.map(x => x.Name);

  sheet = getCreateSpreadSheet(rootFolder, sheetName, `MailDate\tTransKind\t${fieldNames.join('\t')}`);

  if (onlyUnread) query = "is:unread ";
  if (job.MailFrom.length > 0) query = `${query}'from:"${job.MailFrom}"'`;
  if (job.MailSubject.length > 0) query = `${query} subject:"${job.MailSubject}"`;


  if (!onlyUnread) {
    let dts = getFileLastUpdated(sheetName, job.FolderName);
    query = `${query} after:${dts.getFullYear()}/${(dts.getMonth() + 1).toString().padStart("0", 2)}/${dts.getDate().toString().padStart("0", 2)}`;
  }


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

      let row = processHeaderFields(job, headerFields, plainBody, dt, subject, rootFolder, folder);
      let repeatingRows = processRepeatingFields(job, headerFields, plainBody, dt, subject, rootFolder, folder, batchId);

      config = incrementBatchId(config);


    });
  });
}

function processHeaderFields(job, fields, plainBody, dt, subject, rootFolder, folder) {
  if (fields.length == 0) return row;

  let ix = 0;
  let row = [dt, job.TransType];


  ix = plainBody.indexOf(fields[0].Name);
  if (ix >= 0) plainBody = plainBody.substring(ix);
  ix = plainBody.lastIndexOf(fields[fields.length - 1]);
  if (ix >= 0) plainBody = plainBody.substring(0, fields[fields.length - 1].Name.length);

  let lines = plainBody.split('\n');
  row = [dt, job.Name, job.TransType];


  let done = [];  
  for (i = 0; i < lines.length; i++) {

    for (j = 0; j < fields.length; j++) {
      let f = fields[j];
      if ( done.indexOf(f.Name)>=0) continue;

      if (job.DocYear == 0) {
        let dateFields = fields.filter(x => x.DataType == "D");
        if (dateFields.length > 0 && f.Name == dateFields[0].Name);
        {
          let parts = [];
          let fd;
          if (f.FieldPosInLine >= 0) {
            parts = lines[i + dateFields[0].LineOffset].split(" ");
            if (parts.length >= f.FieldPosInLine) fd = getRawData(f, parts[f.FieldPosInLine].trim());
          }
          else fd = getRawData(f, lines[i + dateFields[0].LineOffset].trim());
          job.DocYear = fd.RawVal.getFullYear();
          job.DocMonth = fd.RawVal.getMonth() + 1;
        }
      }
      if (lines[i].indexOf(f.Name) >= 0) {
        i += f.LineOffset;
        if (f.FieldPosInLine >= 0) {
          let parts = lines[i].split(" ");
          f = getRawData(f, parts[f.FieldPosInLine].trim());
          //else f = getRawData(f, lines[i].trim());
        }
        else f = getRawData(f, lines[i].trim());
        row.push(f.RawVal);
        done.push(f.Name);
          Logger.log(`${f.FieldAlias} ${f.RawVal}`);
        if (f.Alias == "BatchName") job.BatchName = f.RawVal;
        break;
      }
    }
  }
  Logger.log(JSON.stringify(row));
  return row;
}


function processRepeatingFields(job, headerFields, plainBody, dt, subject, rootFolder, folder, batchId) {
  let rows = [];
  return rows;

}

function tryDate(val, sep, format) {
  let parts = val.split(sep);

  let arr = [0, 0, 0];
  if (format == "DMY") {
    arr[0] = Number(parts[2]);
    arr[1] = Number(parts[1]) - 1;
    arr[2] = Number(parts[0]);
  }
  else if (format == "MDY") {
    arr[0] = Number(parts[2]);
    arr[1] = Number(parts[0]) - 1;
    arr[2] = Number(parts[1]);

  }
  else {
    arr[0] = Number(parts[0]);
    arr[1] = Number(parts[1]) - 1;
    arr[2] = Number(parts[2]);

  }

  let dt = new Date(arr[0], arr[1], arr[2])
  return dt;
}

function tryTime(val, sep, dt = null) {
  let parts = val.split(sep);
  let hr = [0, 0, 0];
  if (parts.length >= 2) {
    hr[0] = Number(parts[0]);
    hr[1] = Number(parts[1]);
  } else if (parts.length >= 3) {
    hr[2] = Number(parts[2]);
  }
  let dt2;
  if (dt != null) dt2 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), hr[0], hr[1], hr[2]);
  else dt2 = new Date(0, 0, 0, hr[0], hr[1], hr[2]);
  return dt2;

}

function getRawData(field, val) {
  if (field.DataType == "%" || val.includes("%")) {
    val = removeExclusions(val, field.Exclude);
    val = val.replaceAll(",",".");
    field.RawVal = Number(val) / 100;
  }
  else if (field.DataType == "$" || val.includes("$")) {
    val = removeExclusions(val, field.Exclude);
    let parts = val.split(" ");
    if (parts.length >= 2) {
      field.RawVal = Number(parts[1].replaceAll(".", "").replace(",", "."));
      field.Currency = parts[0];
    }
    else {
      field.RawVal = Number(parts[0].replaceAll(".", "").replace(",", ".").replace("$", ""));
      field.Currency = "$";
    }
    return field;
  }
  else if (field.DataType == "D") {
    val = removeExclusions(val, field.Exclude);
    let parts = val.split(" ");
    let dt;
    if (parts.length >= 2) {
      dt = tryDate(parts[0], field.Separators[0], field.Mask);
      dt = tryTime(parts[1], field.Separators[1], dt);
    }
    else if (parts.length >= 1) {
      dt = tryDate(parts[0], field.Separators[0], field.Mask);
    }
    field.RawVal = dt;
  }
  else {
    val = removeExclusions(val, field.Exclude);
    field.RawVal = val;
    field.DataType = "T";
  }
  return field;
}


function removeExclusions(val, excludes) {
  if (excludes == "") return val;

  let chars = excludes.split('');

  chars.forEach(ch => val = val.replaceAll(ch,""));

  return val.trim();
}




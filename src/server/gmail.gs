
function queryGmail(sheetName, query, triggers, folderName, kind, maxMails = 500) {
  let sheet;
  let folder;
  let lines = [];
  let plainBody = "";
  let dt;
  let subject = "";


  folder = getCreateFolder(folderName);
  sheet = getCreateSpreadSheet(folder, sheetName, `MailDate\tTranType\t${triggers.join('\t')}`);

  let dts = getFileLastUpdated(sheetName, folderName);
  query = `${query} after:${dts.getFullYear}/${dts.getMonth + 1}/${dts.getDate()}`;

  let i = 0;
  const threads = GmailApp.search(query, 0, maxMails);
  threads.forEach((thread) => {
    const messages = thread.getMessages();
    messages.forEach((message) => {
      dt = message.getDate();
      plainBody = message.getPlainBody();
      subject = message.getSubject();

      let ix = plainBody.indexOf(triggers[0], 0);
      if (ix > 0)
        plainBody = plainBody.substring(ix);

      ix = plainBody.lastIndexOf(triggers[triggers.length - 1], 0);
      if (ix >= 0) plainBody = plainBody.substring(ix + triggers[triggers.length - 1].length);

      lines = plainBody.split('\n');
      let row = getMidIneroMovimientos(triggers, lines, kind, dt, subject);

      if (row.length > 2) {
        sheet.appendRow(row);
        Logger.log(`${i}\t${row.length}\t${JSON.stringify(row)}`);
      }
      i++;
    });
  });
  return i;
}




function queryGmailFlat(triggers, sheetName, query, folderName, kind, maxMails = 500) {
  let sheet;
  let folder;
  let lines = [];
  let plainBody = "";
  let dt;
  let subject = "";
  let i =0;


  folder = getCreateFolder(folderName);
  sheet = getCreateSpreadSheet(folder, sheetName, `MailDate\tTranType\t${triggers.join('\t')}`);

  let dts = getFileLastUpdated(sheetName, folderName);
  query = `${query} after:${dts.getFullYear}/${dts.getMonth + 1}/${dts.getDate()}`;


  const threads = GmailApp.search(query, 0, maxMails);
  threads.forEach((thread) => {
    const messages = thread.getMessages();
    messages.forEach((message) => {
      dt = message.getDate();
      plainBody = message.getPlainBody();
      subject = message.getSubject();
      let row = movBancolombia(plainBody, kind, dt, subject);

      if (row.length > 2) {
        sheet.appendRow(row);
        Logger.log(`${i}\t${row.length}\t${JSON.stringify(row)}`);
      }
      i++;
    });
  });
  return i;
}


function queryGmailFlat2(triggers, sheetName, query, folderName, kind, maxMails = 500) {
  let sheet;
  let folder;
  let lines = [];
  let plainBody = "";
  let dt;
  let subject = "";


  folder = getCreateFolder(folderName);
  sheet = getCreateSpreadSheet(folder, sheetName, `MailDate\tTranType\t${triggers.join('\t')}`);

  let dts = getFileLastUpdated(sheetName, folderName);
  query = `${query} after:${dts.getFullYear}/${dts.getMonth + 1}/${dts.getDate()}`;


  let i = 0;
  const threads = GmailApp.search(query, 0, maxMails);
  threads.forEach((thread) => {
    const messages = thread.getMessages();
    messages.forEach((message) => {
      dt = message.getDate();
      plainBody = message.getPlainBody();
      subject = message.getSubject();
      let row = bancolombiaNomina(plainBody, kind, dt, subject);

      if (row.length > 2) {
        sheet.appendRow(row);
        Logger.log(`${i}\t${row.length}\t${JSON.stringify(row)}`);
      }
      i++;
    });
  });
  return i; 
}

function isDate(val) {
  let result = { Valid: false, Value: null };
  let re = /^[0-9]*$/;
  let sep = "/";
  let y, m, d = 0;

  if (val.includes(".")) sep = ".";
  if (val.includes("-")) sep = "-";

  let parts = val.split(sep);
  if (parts.length == 3) {
    let numbers = parts.map(x => re.test(x));
    let allNumbers = numbers.join();
    if (allNumbers == "true,true,true") {
      parts = parts.map(x => Number(x));
      if (parts[0] > 2000 && parts[0] < 9999) {
        y = parts[0];
        m = parts[1];
        d = parts[2];
      }
      else if (parts[2] > 2000 && parts[2] < 9999) {
        y = parts[2];
        d = parts[0];
        m = parts[1];
      }
      result.Value = new Date(y, m - 1, d);
      result.Valid = true;
      result.Mask = "D";
    }
    else {
      result.Value = val;
      result.Valid = true;
      result.Mask = "A";

    }
  }
  return result;
}

function isPercent(val)
{
  val = val.trim();
  let re =  /^-?\d+(\.\d+)?%$/;
  let result = { Valid: false, Value: null };

if (re.test(val)) {
  result.Valid = true;
  result.Value = Number(val.replace("%",""))/100;
  result.Mask = "%";
}

return result;

}
function isNumber(val) {
  let re = /^-?\d+$/;
  let result = { Valid: false, Value: null };

  if (re.test(val)) {
    result.Valid = true;
    result.Value = Number(val);
    result.Mask = "N";
  }

  return result;
}

function isMoney(val) {
  val = val.trim();
  if ( val.includes(" "));
  {
    let parts = val.split(" ");
    if ( parts.length == 1) val = parts[0];
    if ( parts.length == 2) val = parts[1];
  }
  if ( val.includes("$"))
    val = val.replace("$","");
  val = val.replaceAll(".","").replace(",",".").trim();
  let re = /^-?\d+(\.\d{1,2})?$/;
  let result = { Valid: false, Value: null };
  if (re.test(val)) {
    result.Valid = true;
    result.Value = Number(val);
    result.Mask = "M";
  }

  return result;

}

function isNumericCode(val) {
  let re = /^(\d+-)*\d+$/
  let result = { Valid: false, Value: null };
  if (re.test(val)) {
    result.Valid = true;
    result.Value = val;
    result.Mask = "C";
  }
  return result;

}

function isCountOf(val) {
  let re = /^\d+\/\d+$/;
  let result = { Valid: false, Value: null };
  if (re.test(val)) {
    result.Valid = true;
    result.Value = val;
    result.Mask = "#";
  }
  return result;

}

function profileLine(l) {
  l = l.trim().replaceAll("\n","");
  let lineProfiles = [];
  let words = l.split(' ');

  let i = 0;
  for (i = 0; i < words.length; i++) {
    let lp = isDate(words[i]);
    if (lp.Valid) { lineProfiles.push(lp); continue;}

    lp = isPercent(words[i]);
    if (lp.Valid) { lineProfiles.push(lp); continue;}

    lp = isNumber(words[i]);
    if (lp.Valid) { lineProfiles.push(lp); continue;}

    lp = isMoney(words[i]);
    if (lp.Valid) { lineProfiles.push(lp); continue;}

    lp = isCountOf(words[i]);
    if (lp.Valid) { lineProfiles.push(lp); continue;}

    lp = isNumericCode(words[i]);
    if (lp.Valid) { lineProfiles.push(lp); continue;}

    lp = {};
    lp.Valid = true;
    lp.Mask = "A";
    lp.Value = words[i];
    lineProfiles.push(lp);
  }
  //lp = {Valid:true,Mask:",",Value:","};
  //lineProfiles.push(lp);

  let nlp = [];
  i = 0;
  while (i < lineProfiles.length) {
    lp = lineProfiles[i];
    if ((lp.Mask == "A")) {
      lp.Mask = "T";
      i++;
      while (i<lineProfiles.length && lineProfiles[i].Mask == "A") {
        lp.Value = `${lp.Value} ${lineProfiles[i].Value}`;
        i++;
      }
      i--;
    }
    nlp.push(lp);
    i++;
  }

  let obj = { Line:l,MaskedFields: nlp, LineMask: nlp.map(x => x.Mask).join("") };
  return obj;

}
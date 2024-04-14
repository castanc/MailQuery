function isDate(val, year = null) {

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
    else if (parts.length == 2) {
      let re = /^-?\d+$/;
      if (re.test(parts[0])
        && re.test(parts[1])) {
  
        if (year == null) y = new Date().getFullYear();
        else y = year;
        d = Number(parts[0]);
        m = parts[1];
        if (d > 0 && d < 32 && m > 0 && m < 13) {
          result.Value = new Date(y, m - 1, d);
          result.Valid = true;
          result.Mask = "D";
        }
  
      }
    }
    return result;
  }
  
  function isPercent(val) {
    if (val.includes(",")) val = val.replace(",", ".");
    val = val.trim();
    let re = /^-?\d+(\.\d+)?%$/;
    let result = { Valid: false, Value: null };
  
    if (re.test(val)) {
      result.Valid = true;
      result.Value = Number(val.replace("%", "")) / 100;
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
  
  //22,607,547.1022,631,736.44
  function isMoneyAndMoney(val, decimalSep = ".") {
    var regex = /[0-9.]*[0-9][0-9.]*\./;
  
    let result = { Valid: false, Value: null };
    if (!regex.test(val)) return result;
  
    let ix = val.indexOf(decimalSep);
    let ix2 = 0;
  
    let results = [];
    if (ix > 0) {
      ix2 = val.indexOf(decimalSep, ix + 1);
      if (ix2 > ix) {
        val = val.replaceAll(",", "");
        let parts = val.split(decimalSep);
        for (let i = 0; i < parts.length - 1; i++) {
          let value = `${parts[i]}.${parts[i + 1].substr(0, 2)}`;
          parts[i + 1] = parts[i + 1].substr(2);
          let n = Number(value);
          result = { Valid: true, Mask: "M", Value: n };
          results.push(result);
        }
  
      }
    }
    return results;
  
  }
  
  //41,414,815.516/01
  function isMoneyAndDate(val, year = null) {
    if (year == null) year = new Date().getFullYear();
  
    val = val.trim();
    val = val.replaceAll(",", "");
    let moneyVal = "";
    let dateVal = "";
    let ix = 0;
    let result = { Valid: false, Value: null };
    let result1 = { Valid: false, Value: null };
  
  
    if (val.includes(".") && val.includes("/")) {
      ix = val.indexOf(".");
      moneyVal = val.substr(0, ix + 3);
      dateVal = val.substring(ix + 3);
      result.Value = Number(moneyVal);
      result.Valid = true;
      result.Mask = "M";
  
      let parts = dateVal.split("/");
      if (parts.length == 2) {
        result1.Value = new Date(year, Number(parts[1] - 1, Number(parts[0])));
        result1.Valid = true;
        result1.Mask = "D";
  
      }
    }
    return [result, result1];
  
  }
  
  //sdaasdfdsf1/01 o afsddfasdfsa11/01
  function isTextAndDate(val, year = null) {
    val = val.trim();
    let result = { Valid: false, Value: null };
    let result1 = { Valid: false, Value: null };
  
    let parts = val.split("/");
    if (parts.length != 2) return [result, result1];
  
    if (year == null) year = new Date().getFullYear();
  
    let textVal = "";
    let dateVal = "";
    let ix = 0;
  
    let chars = parts[0].split('');
    for (j = chars.length - 1; j >= 0; j--) {
      let n = isNumber(chars[j]);
      if (n.Valid) dateVal = `${dateVal}${chars[j]}`;
      else {
        textVal = parts[0].substr(0, j + 1);
        result.Valid = true;
        result.Mask = "T";
        result.Value = textVal;
        break;
      }
    }
    dateVal = `${dateVal}/${parts[1].trim()}`;
    result1 = isDate(dateVal);
    return [result, result1];
  
  
  
  
    if (val.includes(".") && val.includes("/")) {
      ix = val.indexOf(".");
      textVal = val.substr(0, ix + 3);
      dateVal = val.substring(ix + 3);
      result.Value = textVal;
      result.Valid = true;
      result.Mask = "T";
  
      let parts = dateVal.split("/");
      if (parts.length == 2) {
        result1.Value = new Date(year, Number(parts[1] - 1, Number(parts[0])));
        result1.Valid = true;
        result1.Mask = "D";
  
      }
    }
  }
  
  
  function isMoney(val, decimalSep = ".") {
    let result = { Valid: false, Value: null };
  
    if (!val.includes(decimalSep)) return result;
  
    val = val.trim();
  
    if (val.includes("$"))
      val = val.replace("$", "");
  
    if (decimalSep != ".") val = val.replaceAll(".", "").replace(",", ".").trim();
    else val = val.replaceAll(",", "").trim();
  
    let re = /^-?\d+(\.\d{1,2})?$/;
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
  
  function profileLine(l, lineNo = 0) {
    l = l.trim();
    let lineProfiles = [];
    let words = l.split(' ');
  
    let i = 0;
    for (i = 0; i < words.length; i++) {
      let pair = isMoneyAndDate(words[i]);
      if (pair[0].Valid && pair[1].Valid) {
        lineProfiles.push(pair[0]);
        lineProfiles.push(pair[1]);
        continue;
      }
  
      let lps = isMoneyAndMoney(words[i]);
      if (lps.length > 0) {
        lps.forEach(lp => {
          if (lp.Valid) lineProfiles.push(lp);
        });
        continue;
      }
  
      let lp = isDate(words[i]);
      if (lp.Valid) { lineProfiles.push(lp); continue; }
  
      pair = isTextAndDate(words[i]);
      if (pair[0].Valid && pair[1].Valid) {
        lineProfiles.push(pair[0]);
        lineProfiles.push(pair[1]);
        continue;
      }
  
  
  
      lp = isPercent(words[i]);
      if (lp.Valid) { lineProfiles.push(lp); continue; }
  
      // lp = isNumber(words[i]);
      // if (lp.Valid) { lineProfiles.push(lp); continue;}
  
      lp = isMoney(words[i]);
      if (lp.Valid) { lineProfiles.push(lp); continue; }
  
      // lp = isCountOf(words[i]);
      // if (lp.Valid) { lineProfiles.push(lp); continue;}
  
      // lp = isNumericCode(words[i]);
      // if (lp.Valid) { lineProfiles.push(lp); continue;}
  
      lp = {};
      lp.Valid = true;
      lp.Mask = "A";
      lp.Value = words[i];
      lineProfiles.push(lp);
    }
  
    let nlp = [];
    i = 0;
    while (i < lineProfiles.length) {
      lp = lineProfiles[i];
      if ((lp.Mask == "A")) {
        lp.Mask = "T";
        i++;
        while (i < lineProfiles.length && lineProfiles[i].Mask == "A") {
          lp.Value = `${lp.Value} ${lineProfiles[i].Value}`;
          i++;
        }
        i--;
      }
      nlp.push(lp);
      i++;
    }
  
    let obj = { LineNo: lineNo, Line: l, MaskedFields: nlp, LineMask: nlp.map(x => x.Mask).join("") };
    return obj;
  
  }    
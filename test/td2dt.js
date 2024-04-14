function TD2DT(outPages)
{
  /*
  if linemask == D and next is TD OR ( CURRENT == TD AND NEXT == TD)


  */
  let nr = [];
  let lastD = null;
  let newT = null;
  let r1 = { Valid: false, Value: null };
  let r2 = { Valid: false, Value: null };
  let newPages = [];
  let newPage = [];
  let changed = 0;
  let startLine0 =-1;
  let startLine1 = -1;
  let endLine = -1;
  
  for(let i=0;i<outPages.length;i++)
  {
    let op = outPages[i];
    np = [];
    let DTRows = [];
    for(let j=0;j<op.length-1;j++){
      let c = op[j];
      let n = op[j+1];
      if ( c.LineMask == "D" && n.LineMask == "TD")
      {
          r1.Valid = true;
          r1.LineMask = "DT";
          r1.LineNo = c.LineNo;
          r1.MaskedFields = [];
          r1.MaskedFields.push(c.MaskedFields[0]);
          r1.MaskedFields.push(n.MaskedFields[0]);
          r1.LineNo = c.lineNo;
          r1.Line = `${n.Line} ${c.Line}`;
          np.push(r1);
          DTRows.push(r1);
          startLine0 = j;
          changed++;

          lastD = {Valid:true,LineMask:"DT",LineNo:n.LineNo,Line:`${c.Line} ${n.Line}`, MaskedFields:[]};
          lastD.MaskedFields = [];
          lastD.MaskedFields.push(n.MaskedFields[1]);
          j+=2;
      }
      else if ( c.LineMask == "TD" && n.LineMask == "TD")
      {
        if ( lastD != null ) r1 = lastD;
        else r1 = {Valid:true,LineMask:"DT",LineNo:c.LineNo,Line:`${n.MaskedFields[1].Value} ${c.MaskedFields[0].Value}`, MaskedFields:[]};
        r1.MaskedFields.push(c.MaskedFields[1]);
        r1.MaskedFields.push(n.MaskedFields[0]);
        np.push(r1);
        DTRows.push(r1);
        startLine1 = j;
        changed++;


        lastD = {
          Valid:true,
          LineMask:"DT",
          LineNo:n.LineNo,
          Line:`${n.MaskedFields[1].Value} ${c.MaskedFields[0].Value}`, 
          MaskedFields:[]
        };
        lastD.MaskedFields.push(n.MaskedFields[1]);
        j+=2;
      }
      else if ( n.LineMask != "TD") { endLine = j; np.push(n);} 
      else if (lastD !=null)
      {
        r1 = {
          Valid:true,
          LineMask:"DT",
          LineNo:lastD.LineNo,
          Line:`${lastD.MaskedFields[0].Value} ${c.MaskedFields[0].Value}`, 
          MaskedFields:[]
        };
        r1.MaskedFields.push(c.MaskedFields[1]);
        np.push(r1);
        changed++;
        DTRows.push(r1);

        j+=1;

      }
    }
    newPages.push(
      {
        TDChanges:changes, 
        StartLine0:startLine0, 
        StartLine1:startLine1, 
        EndLine:endLine, 
        rows:np,
        DTRows: DTRows
      });
  }
  return newPages;
}

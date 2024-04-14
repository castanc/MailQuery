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
  
  for(let i=0;i<outPages.length;i++)
  {
    let op = outPages[i];
    np = [];
    for(let j=0;j<op.length-1;j++){
      let c = op[j];
      let n = op[j+1];
      if ( c.LineMask == "D" && n.LineMask == "TD")
      {
          r1.Valid = true;
          r1.LineMask = "DT";
          r1.MaskedFields.push(lastD.MaskedFields[0]);
          r1.MaskedFields.push(n.MaskedFields[0]);
          r1.LineNo = lasD.lineNo;
          r1.Line = `${n.Line} ${lastD.Line}`;
          np.push(r1);

          lastD = n;
          lastD.MaskedFields = [];
          lastD.MaskedFields.push(n.MaskedFields[1]);
          j+=2;
      }
      else if ( c.LineMask == "TD" && n.LineMask == "TD")
      {
        if ( lastD != null ) r1 = lastD;
        else r1 = {Valid:true,LineMask:"DT",LineNo:c.LineNo,Line:`${n.Line} ${c.Line}`, MaskedFields=[]};
        r1.MaskedFields.push(c.MaskedFields[1]);
        r1.MaskedFields.push(n.MaskedFields[0]);
        np.push(r1);

        lastD = n;
          lastD.MaskedFields = [];
          lastD.MaskedFields.push(n.MaskedFields[1]);

      }
      else np.push(c);
    }
    newPages.push(np);
  }
  return newPages;
}

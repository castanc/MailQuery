function DMY2YMD(val) {
  let parts = val.split(" ");
  let hparts = [];
  let y, d, m, h, mn, s = 0;

  if (parts.length >= 2) {
    hparts = parts[1].split(':');
    if (hparts.length >= 2) {
      h = Number(hparts[0]);
      mn = Number(hparts[1]);
    }
  }
  if (parts.length >= 1) {
    hparts = parts[0].split('/');
    if (hparts.length >= 3) {
      y = Number(hparts[2]);
      m = Number(hparts[1]);
      d = Number(hparts[0]);
    }
  }
  return new Date(y, m, d, h, mn, s);

}

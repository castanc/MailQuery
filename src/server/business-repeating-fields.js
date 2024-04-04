function processRepeatingFields(job, fields, repeatingText) {
  let fieldsRepeating = fields.filter(x => x.FieldRepeating != "");
  let repeatingRows = [];
  if (repeatingText.length > 0) {
    if (job.RepeatingFieldsFunction.length > 0) {
      let func = window[job.RepeatingFieldsFunction];
      repeatingRows = func(job, fieldsRepeating);
    }
    else {
      repeatingRows = processRepeating(job, fields, fieldsRepeating);
    }

  }
}
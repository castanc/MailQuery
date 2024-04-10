function readPDFTextFromEmail() {
    var threads = GmailApp.search("has:attachment filename:pdf"); // Search for emails with PDF attachments
    var messages = GmailApp.getMessagesForThreads(threads);
    
    for (var i = 0; i < messages.length; i++) {
      var attachments = messages[i][0].getAttachments(); // Get attachments of the first message in each thread
      for (var j = 0; j < attachments.length; j++) {
        if (attachments[j].getContentType() === "application/pdf") {
          var pdfBlob = attachments[j].copyBlob(); // Get PDF blob
          var pdfText = extractTextFromPDF(pdfBlob); // Extract text from PDF
          Logger.log(pdfText); // Output extracted text to the Logger
        }
      }
    }
  }
  
  function extractTextFromPDF(pdfBlob) {
    var resource = {
      title: pdfBlob.getName(),
      mimeType: pdfBlob.getContentType()
    };
  
    var options = {
      ocr: true
    };
  
    var doc = Drive.Files.insert(resource, pdfBlob, options); // Convert PDF to Google Document (text)
    var docContent = DocumentApp.openById(doc.id).getBody().getText(); // Get text from Google Document
    Drive.Files.remove(doc.id); // Remove the temporary Google Document
    return docContent;
  }
  
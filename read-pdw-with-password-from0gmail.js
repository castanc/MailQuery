function readPasswordProtectedPDFText() {
    var threads = GmailApp.search("has:attachment filename:pdf"); // Search for emails with PDF attachments
    var messages = GmailApp.getMessagesForThreads(threads);
    
    for (var i = 0; i < messages.length; i++) {
      var attachments = messages[i][0].getAttachments(); // Get attachments of the first message in each thread
      for (var j = 0; j < attachments.length; j++) {
        if (attachments[j].getContentType() === "application/pdf") {
          var pdfBlob = attachments[j].copyBlob(); // Get PDF blob
          var pdfText = extractTextFromPDF(pdfBlob, "your_password_here"); // Extract text from PDF providing the password
          Logger.log(pdfText); // Output extracted text to the Logger
        }
      }
    }
  }
  
  function extractTextFromPDF(pdfBlob, password) {
    var pdfBytes = pdfBlob.getBytes();
    var pdfjsLib = eval(UrlFetchApp.fetch("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js").getContentText());
  
    // Load PDF document
    var pdfDoc = pdfjsLib.getDocument({
      data: pdfBytes,
      password: password
    }).promise;
  
    return pdfDoc.then(function(doc) {
      var numPages = doc.numPages;
      var fullText = '';
  
      // Extract text from each page
      var getPageText = function(pageNum) {
        return doc.getPage(pageNum).then(function(page) {
          return page.getTextContent().then(function(textContent) {
            var pageText = '';
            for (var i = 0; i < textContent.items.length; i++) {
              var text = textContent.items[i].str;
              pageText += text + ' ';
            }
            return pageText;
          });
        });
      };
  
      // Iterate through each page and append text
      var promises = [];
      for (var i = 1; i <= numPages; i++) {
        promises.push(getPageText(i));
      }
  
      return Promise.all(promises).then(function(pagesText) {
        for (var i = 0; i < pagesText.length; i++) {
          fullText += pagesText[i];
        }
        return fullText;
      });
    });
  }
  
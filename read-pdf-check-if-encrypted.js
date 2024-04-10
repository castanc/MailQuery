const reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.onload = function () {

var files = new Blob([reader.result], {type: 'application/pdf'});
files.text().then(x=> {
    console.log("isEncrypted", x.includes("Encrypt")) // true, if Encrypted
    console.log("isEncrypted", x.substring(x.lastIndexOf("<<"), x.lastIndexOf(">>")).includes("/Encrypt"));
    console.log(file.name);
});
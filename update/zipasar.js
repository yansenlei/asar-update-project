const AdmZip = require('adm-zip')
const path = require('path')
const zip = new AdmZip()

// add local file
zip.addLocalFile(path.join(__dirname, 'update.asar'))
// get everything as a buffer
zip.toBuffer()
// or write everything to disk
zip.writeZip(path.join(__dirname, 'update.zip'))

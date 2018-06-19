const path = require('path')
const fs = require('fs')

const PrologFile = require('./prolog-file')

function findInDir (dir, extension, excludes) {
  // See if the directory even exists
  if (!fs.existsSync(dir) || dir.endsWith('.git') || dir.endsWith('Tests')) {
    return []
  }

  // Directory excludes
  for (var exclude of excludes) {
    if (dir.endsWith(exclude)) {
      return []
    }
  }

  var files = []

  // Find all the files in this directory
  for (var file of fs.readdirSync(dir)) {
    // File excludes
    if (excludes.includes(file)) {
      continue
    }

    // Get the path to the file
    var filePath = path.join(dir, file)

    if (!fs.existsSync(filePath)) {
      continue
    }

    // Call recursively if this is a direcotory
    var stats = fs.lstatSync(filePath)

    if (stats.isDirectory()) {
      files = files.concat(findInDir(filePath, extension, excludes))
    }

    // Add the file otherwise, if it fith the extension
    if (filePath.endsWith('.' + extension)) {
      files.push(new PrologFile(filePath, file))
    }
  }

  return files
}

module.exports = findInDir

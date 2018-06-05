const path = require("path")
const fs = require("fs")

function findInDir(dir, extension) {
    // See if the directory even exists
    if (!fs.existsSync(dir) || dir.endsWith(".git")) {
        return []
    }

    var files = []

    // Find all the files in this directory
    for (var file of fs.readdirSync(dir)) {
        // Get the path to the file
        var filename = path.join(dir, file)

        // Call recursively if this is a direcotory
        var stats = fs.lstatSync(filename)
        if (stats.isDirectory()) {
            files = files.concat(findInDir(filename, extension))
        }

        // Add the file otherwise, if it fith the extension
        if (filename.endsWith('.' + extension)) {
            console.log(filename)
            files.push(filename)
        }
    }

    return files
}

module.exports = findInDir

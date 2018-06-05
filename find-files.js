const path = require("path")
const fs = require("fs")

const PrologFile = require("./prolog-file")

function findInDir(dir, extension, excludes) {
    // See if the directory even exists
    if (!fs.existsSync(dir) || dir.endsWith(".git") || dir.endsWith('Tests')) {
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
        var filename = path.join(dir, file)

        // Call recursively if this is a direcotory
        var stats = fs.lstatSync(filename)
        if (stats.isDirectory()) {
            files = files.concat(findInDir(filename, extension, excludes))
        }

        // Add the file otherwise, if it fith the extension
        if (filename.endsWith('.' + extension)) {
            files.push(new PrologFile(filename))
        }
    }

    return files
}

module.exports = findInDir

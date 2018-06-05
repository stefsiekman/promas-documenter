const findFiles = require("./find-files")

const config = require("./config")

var files = findFiles(config.path.project, "pl", config.excludes)

console.log(`Found ${files.length} prolog files to analyze.`)

for (var file of files) {
    file.analyze()
    console.log(`${file.filename}: ${file.predicates.length} predicates found`)
}

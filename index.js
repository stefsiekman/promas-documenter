const gitbranch = require('git-branch')
const PrologCollection = require('./prolog-collection')

const config = require("./config")

// See which steps have to be executed
var doReport = process.argv.includes('report') || process.argv.includes('r')
var doGen = process.argv.includes('generate') || process.argv.includes('g')
var doReport = doReport || doGen
var silent = process.argv.includes('silent') || process.argv.includes('s')

if (!doReport) {
    console.log('No action specified, use one of the following:')
    console.log('    node index.js r[eport]')
    console.log('    node index.js g[enerate]')
    console.log('    npm start r[eport]')
    console.log('    npm start g[enerate]')
    process.exit()
}

var collection = new PrologCollection(config)

if (doReport) {
    collection.analyze()
    if (!silent)
        collection.printWarnings()
    collection.printStats()
}

if (doGen) {
    // Only write if the project is checked out on master
    console.log()
    var branch = gitbranch.sync(config.path.project)
    console.log('Project is on branch:', branch)

    if (branch !== 'master') {
        console.log('Not on master, files won\'t be generated')
        process.exit()
    }

    collection.write()
}

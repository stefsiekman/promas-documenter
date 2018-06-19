const cli = require('cli')
const fs = require('fs')
const gitbranch = require('git-branch')
const PrologCollection = require('./prolog-collection')

const config = require('./config')

cli.enable('help', 'version')
cli.setApp('ProMAS Documenter', require('./package.json').version)
const options = cli.parse({
  report: ['r', 'Report on the documentation, parses the Prolog', 'on', false],
  generate: ['g', 'Generates the markdown files', 'on', false],
  silent: ['s', 'Mutes warnings, only shows the count', 'on', false],
  project: ['p', 'Project repository location', 'dir', config.path.project],
  wiki: ['w', 'Wiki repository location', 'dir', config.path.wiki],
  force: ['f', 'Override branch protection', 'on', false]
})

if (!fs.existsSync(options.project)) {
  console.error('Invalid project location')
  process.exit(1)
}

if (options.generate && !fs.existsSync(options.wiki)) {
  console.error('Invalid wiki location')
  process.exit(1)
}

if (!options.report && !options.generate) {
  console.log('No action specified, see help.')
  process.exit()
}

var collection = new PrologCollection(options.project, config.excludes)

if (options.report || options.generate) {
  collection.analyze()
  if (!options.silent) { collection.printWarnings() }
  collection.printStats()
}

if (options.generate) {
  // Only write if the project is checked out on master
  console.log()
  var branch = options.force ? 'master' : gitbranch.sync(options.project)

  if (!options.force) { console.log('Project is on branch:', branch) }

  if (branch !== 'master') {
    console.log('Not on master, files won\'t be generated')
    process.exit()
  }

  collection.write(options.wiki)
}

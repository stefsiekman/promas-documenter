const path = require('path')
const PageSet = require('./page-set')
const findFiles = require('./find-files')

class PrologCollection {
  constructor (project, excludes) {
    this.files = findFiles(project, 'pl', excludes)
    console.log(`Found ${this.files.length} prolog files to analyze.`)
  }

  analyze () {
    for (var file of this.files) { file.analyze() }

    this.gatherPredicates()
    this.removeDuplicates()
    this.sort()
  }

  gatherPredicates () {
    this.predicates = []

    for (var file of this.files) { this.predicates = this.predicates.concat(file.predicates) }

    return this.predicates
  }

  removeDuplicates () {
    var newPredicates = []

    while (this.predicates.length > 0) {
      var predicate = this.predicates.pop()

      // Find duplicate predicates
      for (var i = 0; i < this.predicates.length; i++) {
        var otherPredicate = this.predicates[i]

        if (!predicate.equals(otherPredicate)) {
          continue
        }

        // Copy the information from this other predicate to the original
        predicate.merge(otherPredicate)

        // Remove the predicate from the array
        this.predicates.splice(i, 1)
        i--
      }

      newPredicates.push(predicate)
    }

    this.predicates = newPredicates
  }

  sort () {
    this.predicates.sort((a, b) => {
      var aName = a.niceName().toLowerCase()
      var bName = b.niceName().toLowerCase()
      if (aName < bName) {
        return -1
      } else if (aName > bName) {
        return 1
      }
      return 0
    })
  }

  write (wiki) {
    var staticPages = new PageSet('predicates')
    var dynamicPages = new PageSet('dynamic-predicates')

    for (var predicate of this.predicates) {
      if (predicate.type() === 'static') {
        staticPages.addPredicate(predicate)
      } else if (predicate.type() === 'dynamic') {
        dynamicPages.addPredicate(predicate)
      } else {
        console.error('Invalid predicate type:', predicate.type())
      }
    }

    console.log('Pages to write:',
      staticPages.pages.length + dynamicPages.pages.length)

    var documentationFolder = path.join(wiki, 'documentation')
    staticPages.write(documentationFolder)
    dynamicPages.write(documentationFolder)

    console.log('Done!')
  }

  printStats () {
    var predicates = this.predicates.length
    var argumentCount = 0
    var scoreTotal = 0
    var warnings = 0

    for (var predicate of this.predicates) {
      argumentCount += predicate.definition.args
      scoreTotal += predicate.score()
      warnings += predicate.warnings.length
    }

    var scoreAverage = scoreTotal / predicates

    console.log('Predicates   ', predicates)
    console.log('Arguments    ', argumentCount)
    console.log('Average score', ~~scoreAverage)
    console.log('Warnings     ', warnings)
  }

  printWarnings () {
    console.log('Warning report:')

    var warnings = 0

    for (var predicate of this.predicates) {
      if (predicate.warnings.length < 1) { continue }

      console.log('    ' + predicate.definitionName())
      for (var warning of predicate.warnings) { console.log('        ' + warning) }

      console.log('')

      warnings += predicate.warnings.length
    }

    return warnings !== 0
  }
}

module.exports = PrologCollection

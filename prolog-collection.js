const findFiles = require("./find-files")

class PrologCollection {

    constructor(config) {
        this.files = findFiles(config.path.project, "pl", config.excludes)
        console.log(`Found ${this.files.length} prolog files to analyze.`)
    }

    analyze() {
        for (var file of this.files)
            file.analyze()

        this.gatherPredicates()
        this.removeDuplicates()
    }

    gatherPredicates() {
        this.predicates = []

        for (var file of this.files)
            this.predicates = this.predicates.concat(file.predicates)

        return this.predicates
    }

    removeDuplicates() {
        var newPredicates = []

        while (this.predicates.length > 0) {
            var predicate = this.predicates.pop()

            // Find the highest score
            for (var i = 0; i < this.predicates.length; i++) {
                var otherPredicate = this.predicates[i]

                if (!predicate.equals(otherPredicate)) {
                    continue
                }

                if (otherPredicate.score() > predicate.score())
                    predicate = otherPredicate

                // Remove the predicate from the array
                this.predicates.splice(i, 1)
                i--
            }

            newPredicates.push(predicate)
        }

        this.predicates = newPredicates

        this.printStats()
    }

    printStats() {
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

    printWarnings() {
        console.log('Warning report:')

        var warnings = 0

        for (var predicate of this.predicates) {
            if (predicate.warnings.length < 1)
                continue

            console.log('    ' + predicate.definitionName())
            for (var warning of predicate.warnings)
                console.log('        ' + warning)

            console.log('')

            warnings += predicate.warnings.length
        }

        console.log(`Encountered ${warnings} warnings in total`)
    }

}

module.exports = PrologCollection

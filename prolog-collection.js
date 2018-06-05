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

                if (otherPredicate.score() > predicate.score)
                    predicate = otherPredicate

                // Remove the predicate from the array
                this.predicates.splice(i, 1)
                i--
            }

            newPredicates.push(predicate)
        }

        this.predicates = newPredicates

        console.log(`A total of ${this.predicates.length} unique predicates`)
    }

}

module.exports = PrologCollection

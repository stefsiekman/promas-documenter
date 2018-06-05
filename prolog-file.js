const fs = require("fs")

class PrologFile {

    constructor(filename) {
        this.filename = filename
        this.data = fs.readFileSync(filename, {encoding: "utf8"})
    }

    lines() {
        return this.data.split('\n')
    }

    analyze() {
        this.findCommentLines()
        this.findPredicates()
    }

    findCommentLines() {
        this.commentLines = []

        var lines = this.lines()
        for (var i = 0; i < lines.length; i++) {
            if (/[ \t]*%/.test(lines[i])) {
                this.commentLines.push(i)
            }
        }
    }

    findPredicates() {
        console.log("analyzing predicates in", this.filename)

        var lines = this.lines()
        for (var i = 0; i < lines.length; i++) {
            // Exclude comment lines
            if (this.commentLines.includes(i))
                continue

            // Try to find dynamic predicates
            var dynamicResult = /([a-zA-Z])+\/([0-9])+/.exec(lines[i])
            if (dynamicResult) {
                console.log(dynamicResult[0])
            }
        }
    }

    commentLines() {
        return this.commentLines
    }

}

module.exports = PrologFile

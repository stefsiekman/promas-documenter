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
        this.readDynamicPredicates()
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

    readDynamicPredicates() {

    }

    commentLines() {
        return this.commentLines
    }

}

module.exports = PrologFile

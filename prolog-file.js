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
            if (/^([ \t]*%)/.test(lines[i])) {
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

            // Try to find static predicates
            var staticRegex = /[a-zA-Z]+\(([A-Z]+[a-zA-Z]+\,\s)*([A-Z]+[a-zA-Z]+)\)(?=\s:-)/
            var staticResult = staticRegex.exec(lines[i])
            if (staticResult) {
                console.log(staticResult[0])
            }
        }
    }

    commentLines() {
        return this.commentLines
    }

    commentTextBefore(lineNumber) {
        // Go to the line before
        lineNumber--

        // Find comment lines
        var lines = this.lines()
        var commentLines = []
        while (this.commentLines.includes(lineNumber)) {
            commentLines.push(lines[lineNumber])
            lineNumber--
        }

        // Remove the comment %
        var textLines = []
        for (var i = commentLines.length - 1; i >= 0; i--) {
            var commentLine = commentLines[i]

            var regexResult = /^[ \t]*\%[ \t]*/.exec(commentLine)
            if (!regexResult) {
                console.error("Invalid comment format:", commentLine)
                continue
            }

            textLines.push(commentLine.substring(regexResult[0].length))
        }

        return textLines.join('\n')
    }

}

module.exports = PrologFile

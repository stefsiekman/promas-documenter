const fs = require('fs')

const DynamicPredicate = require('./dynamic-predicate')
const StaticPredicate = require('./static-predicate')

class PrologFile {
  constructor (path, filename) {
    this.path = path
    this.filename = filename
    this.data = fs.readFileSync(path, {encoding: 'utf8'})
  }

  lines () {
    return this.data.split('\n')
  }

  analyze () {
    this.findCommentLines()
    this.findPredicates()

    for (var i = 0; i < this.predicates.length; i++) {
      this.predicates[i].createTextSet()
    }
  }

  findCommentLines () {
    this.commentLines = []

    var lines = this.lines()
    for (var i = 0; i < lines.length; i++) {
      if (/^([ \t]*%)/.test(lines[i])) {
        this.commentLines.push(i)
      }
    }
  }

  findPredicates () {
    this.predicates = []

    var lines = this.lines()
    for (var i = 0; i < lines.length; i++) {
      // Exclude comment lines
      if (this.commentLines.includes(i)) { continue }

      // Try to find dynamic predicates
      var dynamicResult = /([a-zA-Z])+\/([0-9])+(?=[.,])/.exec(lines[i])
      if (dynamicResult) {
        this.predicates.push(new DynamicPredicate(dynamicResult[0],
                    this.commentTextBefore(i), this.filename, i + 1))
      }

      // Try to find static predicates
      // Yes, this is a monster. I highly recommend regexr.com
      var staticRegex = /[a-zA-Z]+\((((\[((_|([A-Z]+[a-zA-Z]*)),\s*)*(_|([A-Z]+[a-zA-Z]*))\])|_|([A-Z]+[a-zA-Z]*)),\s*)*((\[((_|([A-Z]+[a-zA-Z]*)),\s*)*(_|([A-Z]+[a-zA-Z]*))\])|_|([A-Z]+[a-zA-Z]*))\)(?=\s*:-)/
      var staticResult = staticRegex.exec(lines[i])
      if (staticResult) {
        this.predicates.push(new StaticPredicate(staticResult[0],
                    this.commentTextBefore(i), this.filename, i + 1))
        if (staticResult[0].includes("_")) {
          console.log("Found:", staticResult[0])
        }
      }
    }
  }

  commentLines () {
    return this.commentLines
  }

  commentTextBefore (lineNumber) {
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

      var regexResult = /^[ \t]*%[ \t]*/.exec(commentLine)
      if (!regexResult) {
        console.error('Invalid comment format:', commentLine)
        continue
      }

      textLines.push(commentLine.substring(regexResult[0].length))
    }

    return textLines.join('\n')
  }
}

module.exports = PrologFile

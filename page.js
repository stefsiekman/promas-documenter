class Page {
  constructor (name) {
    this.name = name
    this.predicates = []
  }

  text (pageSetName) {
    var text = this.backLink(pageSetName) + '\n\n'

    for (var predicate of this.predicates) {
      text += predicate.markdown() + '\n\n'
    }

    return text
  }

  backLink (pageSetName) {
    return `[&laquo; Back](documentation/${pageSetName}/${pageSetName})`
  }

  filename () {
    return this.name + '.md'
  }

  backupFilename (number) {
    return this.filename() + '.' + number + '.backup'
  }
}

module.exports = Page

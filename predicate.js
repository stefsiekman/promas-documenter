class Predicate {
  constructor (name, text, file, line) {
    this.name = name
    this.text = text
    this.file = file
    this.line = line

    this.definition = {}

    this.warnings = []

    this.readUsers()
    this.inferUsersFromFile()
  }

  /**
   * Creates a set of texts. Should be called before merging but after text
   * processing.
   */
  createTextSet () {
    this.texts = [{
      users: this.headingUserName(),
      text: this.text
    }]
  }

  merge (other) {
    // Count the desciption sizes of the arguments
    var selfDescCount = 0
    if (this.args) {
      this.args.forEach((a) => { selfDescCount += (a.description || '').length })
    }
    var othrDescCount = 0
    if (other.args) {
      other.args.forEach((a) => { othrDescCount += (a.description || '').length })
    }

    // Count the name sizes of the arguments
    var selfNameCount = 0
    if (this.args) {
      this.args.forEach((a) => { selfNameCount += (a.name || '').length })
    }
    var othrNameCount = 0
    if (other.args) {
      other.args.forEach((a) => { othrNameCount += (a.name || '').length })
    }

    // Set the description first based on description, otherwise names
    if (selfDescCount < othrDescCount) {
      this.args = other.args
    } else if (selfNameCount < othrNameCount) {
      this.args = other.args
    }

    // Merge texts
    for (var text of other.texts) {
      // Find out if this is a new user set
      var newUser = true
      for (var i = 0; i < this.texts.length; i++) {
        if (this.texts[i].users === text.users) {
          newUser = false

          // Add the text
          this.texts[i].text += '\n\n' + text.text

          break
        }
      }

      // Just add new user sets
      if (newUser) {
        this.texts.push(text)
      }
    }
  }

  score () {
    var score = this.text.length

    if (!this.argumentsGenerated) {
      score += 5000
    }

    score += this.users.length * 250

    return score
  }

  equals (other) {
    if (!this.definition || !other.definition) { return false }

    return this.definition.name === other.definition.name &&
            this.definition.args === other.definition.args
  }

  readUsers () {
    var lines = this.text.split('\n')
    this.users = []

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i]

      // See if this is an @user line
      var matchData = line.match(/^@user\s+/)
      if (matchData) {
        this.users.push(line.substring(matchData[0].length))
        // Remove this line from the text
        lines.splice(i, 1)
        i--
      }
    }

    this.text = lines.join('\n')
  }

  inferUsersFromFile () {
    // Read managers
    var managerMatch = this.file.match(/^[A-Z][A-Za-z]+(?=Manager\.pl$)/)
    if (managerMatch) {
      var manager = `${managerMatch[0]} manager`
      manager = manager.replace('Scv', 'SCV')
      if (!this.users.includes(manager)) {
        this.users.push(manager)
      }
      return
    }

    // Read agents
    var agentMatch = this.file.match(/^[A-Z][A-Za-z]+(?=Agent\.pl$)/)
    if (agentMatch) {
      var agent = `${agentMatch[0]} agent`
      if (!this.users.includes(agent)) {
        this.users.push(agent)
      }
      return
    }

    // TerranSCV (Because someone couldn't be consistent with filenaming)
    if (this.file === 'TerranSCV.pl') {
      if (!this.users.includes('SCV agent')) {
        this.users.push('SCV agent')
      }
    }
  }

  niceName () {
    if (this.definition) { return this.definition.name + '/' + this.definition.args }

    return this.name
  }

  nameWithArguments () {
    var name = this.definition.name

    if (this.args) {
      name += '('
      for (var i = 0; i < this.args.length; i++) {
        name += this.args[i].name

        if (i !== this.args.length - 1) { name += ', ' }
      }
      name += ')'
    }

    return name
  }

  definitionName () {
    return this.locationString() + ' ' + this.niceName()
  }

  headingUserName () {
    if (this.users.length < 1) {
      return 'All agents'
    }

    // Add users followed by commas, &'s or nothing
    var name = ''
    for (var i = 0; i < this.users.length; i++) {
      name += this.users[i]

      // Add commas
      if (i < this.users.length - 2) {
        name += ', '
        continue
      }

      // Add ampersand
      if (i < this.users.length - 1) {
        name += ' & '
      }
    }

    return name
  }

  /**
   * Returns the text of this predicate with a markdown heading of the user.
   */
  headedText () {
    // Return nothing if there is no text
    if (this.text.match(/^\s*$/)) {
      return ''
    }
    // Return as-is if it already has a title
    if (this.text.match(/^\s*### /)) {
      return this.text
    }

    // Otherwise, add the title
    return `### ${this.headingUserName()}\n\n${this.text}`
  }

  locationString () {
    return this.file + ':' + this.line
  }

  pageName () {
    var chars = this.definition.name.split('')

    if (chars.length < 1) { return '' }

    var name = chars[0].toLowerCase()

    for (var i = 1; i < chars.length; i++) {
      var c = chars[i]
      // Just add lower case letters
      if (c === c.toLowerCase()) {
        name += c
        continue
      }

      // Otherwise at a dash first
      name += '-' + c.toLowerCase()
    }

    return name
  }

  argNamesFrom (string, setDefinition) {
    this.args = []
    for (var arg of string.match(/((\[((_|([A-Z]+[a-zA-Z]*))\s*(,|\|)\s*)*(_|([A-Z]+[a-zA-Z]*))\])|_|([A-Z]+[a-zA-Z]*))(?!.*\()/g)) {
      this.args.push({
        name: arg
      })
    }

    if (setDefinition) {
      this.definition.args = this.args.length
    }

    this.readArgumentDescriptions()
  }

  readArgumentDescriptions () {
    // TODO: read arg descriptions from dynamic predicates
    // Convert back to lines
    var lines = this.text.split('\n')

    if (lines.length < 1) {
      return
    }

    // Skip until we find the first argument description
    var lineNumber = 0
    while (!lines[lineNumber].match(/^[A-Z][a-zA-Z]*:/)) {
      lineNumber++
      if (lineNumber >= lines.length) {
        this.warnings.push('No arguments described')
        return
      }
    }

    var descriptionStart = lineNumber

    // Start parsing the descriptions
    var argumentName
    var description
    for (;lineNumber < lines.length; lineNumber++) {
      var line = lines[lineNumber]

      var matchData = line.match(/^[A-Z][a-zA-Z]*(?=:\s*)/)
      // See if we start with a new description
      if (matchData) {
        // Time to save the current description
        if (argumentName && description) {
          this.setArgumentDescription(argumentName, description)
        }

        // Start a new description
        argumentName = matchData[0]
        description = line.substring(argumentName.length + 1) + ' '

      // Otherwise, just add to the current description
      } else {
        description += line + ' '
      }
    }

    this.setArgumentDescription(argumentName, description)

    // Remove the description from the text
    lines.splice(descriptionStart, lines.length - descriptionStart)
    this.text = lines.join('\n')

    // Check for missing argument descriptions
    for (var arg of (this.args || [])) {
      if (!arg.description) {
        this.warnings.push(`Argument '${arg.name}' missing description`)
      }
    }
  }

  setArgumentDescription (name, description) {
    for (var i = 0; i < (this.args || []).length; i++) {
      if (this.args[i].name === name) {
        this.args[i].description = description
        return
      }
    }

    this.warnings.push(`Unspecified argument '${name}' described`)
  }

  markdownUserLink (user) {
    var userCased = user
    user = user.toLowerCase()

    // Link to manager documentation
    if (user.match(/\s*manager$/)) {
      user = user.replace(' ', '-')
      return `[${userCased}](documentation/managers/${user})`
    }

    return user
  }

  markdownUserLinks () {
    var links = ''

    for (var i = 0; i < this.users.length; i++) {
      links += this.markdownUserLink(this.users[i])

      if (i !== this.users.length - 1) { links += ', ' }
    }

    return links
  }

  markdownArgumentTable () {
    if (!this.args || this.args.every((val) => !val.description)) { return '' }

    var table = '| Argument | Description |\n| --- | --- |\n'

    for (var arg of this.args) {
      table += `| \`${arg.name}\` | ${arg.description ? arg.description : ''} |\n`
    }

    return table
  }

  markdown () {
    var md = `<a name="${this.definition.args}"></a>\n`
    md += `## ${this.nameWithArguments()}\n\n`

    if (this.users.length > 0) {
      md += `Used by: ${this.markdownUserLinks()}\n\n`
    }
    md += this.markdownArgumentTable() + '\n'

    // Add the texts
    for (var text of this.texts) {
      // Don't add empty texts
      if (text.text.match(/^\s*$/)) {
        continue
      }

      md += `### ${text.users}\n\n${text.text}\n\n`
    }

    return md
  }

  latex () {
    var latex = `\\texttt{${this.niceName()}} & \\begin{tabular}{@{}p{4.5cm}@{}}`

    // Add the arguments
    for (var arg of (this.args || [])) {
      if ((arg.name || '').length > 1 || arg.description) {
        latex += `\\texttt{${this.latexParse(arg.name)}}\\\\`
      }
      if (arg.description) {
        latex += `${this.latexParse(arg.description)}\\\\[5pt]`
      }
    }
    latex += `\\end{tabular} & \\begin{tabular}{@{}p{5.5cm}@{}}`

    // Add the textx
    for (var text of this.texts) {
      if (!(text.text || '').match(/^\s*$/)) {
        latex += `\\textbf{${this.latexParse(text.users)}}\\\\${this.latexParse(text.text)}\\\\`
      } else {
        latex += `Used by \\textbf{${this.latexParse(text.users)}}\\\\`
      }
    }
    latex += `\\end{tabular}`

    return latex + '\\\\ \\midrule '
  }

  latexParse (str) {
    str = str || ''
    str = str.replace(/\\/g, '\\textbackslash')
    str = str.replace(/&/g, '\\&')
    str = str.replace(/%/g, '\\%')
    str = str.replace(/\$/g, '\\$')
    str = str.replace(/#/g, '\\#')
    str = str.replace(/_/g, '\\_')
    str = str.replace(/{/g, '\\{')
    str = str.replace(/}/g, '\\}')
    str = str.replace(/~/g, '\\textasciitilde')
    str = str.replace(/\^/g, '\\textasciicircum')
    str = str.replace(/\[.*\]/, '{$&}')
    return str
  }
}

module.exports = Predicate

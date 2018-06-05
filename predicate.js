class Predicate {

    constructor(name, text, file, line) {
        this.name = name
        this.text = text
        this.file = file
        this.line = line

        this.definition = {}

        this.warnings = []

        this.readUsers()
    }

    score() {
        var score = this.text.length

        if (!this.argumentsGenerated) {
            score += 5000
        }

        score += this.users.length * 250

        return score
    }

    equals(other) {
        if (!this.definition || !other.definition)
            return false

        return this.definition.name === other.definition.name &&
            this.definition.args === other.definition.args
    }

    readUsers() {
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

        // Warn if a predicate has no users
        if (this.users.length < 1) {
            this.warnings.push('No users specified')
        }

        this.text = lines.join('\n')
    }

    niceName() {
        if (this.definition)
            return this.definition.name + '/' + this.definition.args

        return this.name
    }

    nameWithArguments() {
        var name = this.definition.name

        if (this.args) {
            name += '('
            for (var i = 0; i < this.args.length; i++) {
                name += this.args[i].name

                if (i !== this.args.length - 1)
                    name += ', '
            }
            name += ')'
        }

        return name
    }

    definitionName() {
        return this.locationString() + ' ' + this.niceName()
    }

    locationString() {
        return this.file + ':' + this.line
    }

    pageName() {
        var chars = this.definition.name.split('')

        if (chars.length < 1)
            return ""

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

    argNamesFrom(string, setDefinition) {
        this.args = []
        for (var arg of string.match(/[A-Z]+[a-zA-Z]*(?!.*\()/g)) {
            this.args.push({
                name: arg
            })
        }

        if (setDefinition) {
            this.definition.args = this.args.length
        }

        this.readArgumentDescriptions()
    }

    readArgumentDescriptions() {
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
            if (lineNumber >= lines.length)  {
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
            } 
            
            // Otherwise, just add to the current description
            else {
                description += line + ' '
            }
        }

        this.setArgumentDescription(argumentName, description)

        // Remove the description from the text
        lines.splice(descriptionStart, lines.length - descriptionStart)
        this.text = lines.join('\n')

        // Check for missing argument descriptions
        for (var arg of this.args) {
            if (!arg.description) {
                this.warnings.push(`Argument '${arg.name}' missing description`)
            }
        }
    }

    setArgumentDescription(name, description) {
        for (var i = 0; i < this.args.length; i++) {
            if (this.args[i].name === name) {
                this.args[i].description = description
                return
            } else {
                console.log('sufficient', arg)
            }
        }

        this.warnings.push(`Unspecified argument '${name}' described`)
    }

    markdownUserLink(user) {
        return user
    }

    markdownUserLinks() {
        var links = ""

        for (var i = 0; i < this.users.length; i++) {
            links += this.markdownUserLink(this.users[i])

            if (i !== this.users.length - 1)
                links += ', '
        }

        return links
    }

    markdownArgumentTable() {
        if (!this.args)
            return ""
            
        var table = '| Argument | Description |\n| --- | --- |\n'

        for (var arg of this.args) {
            table += `| ${arg.name} | ${arg.description ? arg.description : ''} |\n`
        }

        return table
    }

    markdown() {
        var md = `<a name="${this.definition.args}"></a>\n`
        md += `## ${this.nameWithArguments()}\n\n`

        if (this.users.length > 0) {
            md += `Used by: ${this.markdownUserLinks()}\n\n`
        } else {
            md += '_Not used by any agent_\n\n'
        }
        md += this.markdownArgumentTable() + '\n'
        md += this.text

        return md
    }

}

module.exports = Predicate

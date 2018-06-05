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

    definitionName() {
        return this.locationString() + ' ' + this.niceName()
    }

    locationString() {
        return this.file + ':' + this.line + ':'
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
        // Convert back to lines
        var lines = this.text.split('\n')

        if (lines.length < 1) {
            return
        }

        // Skip until we find the first argument description
        var lineNumber = 0
        while (!lines[lineNumber].match(/^[A-Z][a-zA-Z]*:/)) {
            lineNumber++
            if (lineNumber >= lines.length) 
                return
        }

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
    }

    setArgumentDescription(name, description) {
        for (var i = 0; i < this.args.length; i++) {
            if (this.args[i].name === name) {
                this.args[i].description = description
                return
            }
        }

        this.warnings.push('Unspecified argument described')
    }

}

module.exports = Predicate

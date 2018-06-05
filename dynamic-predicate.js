const Predicate = require('./predicate')

class DynamicPredicate extends Predicate {

    constructor(name, text, file, line) {
        super(name, text, file, line)

        this.definition = {
            name: this.nameString(),
            args: this.argCount()
        }

        // Try to find a definition in the comments
        var defString = text.match(
            new RegExp(this.definition.name + 
                '\\(([A-Z][a-zA-Z]*,\\s*){' + (this.definition.args - 1) +
                '}([A-Z][a-zA-Z]*){1}\\)'))

        if (defString) {
            var string = defString[0]

            // Remove the definition string from the text
            var textArray = this.text.split('')
            textArray.splice(defString.index, string.length)
            this.text = textArray.join('')

            super.argNamesFrom(string)
        }

        // In case nothing could be found
        this.ensureArguments()
    }

    nameString() {
        return this.name.substring(0, this.name.indexOf('/'))
    }

    argCount() {
        return +(this.name.substring(this.name.indexOf('/') + 1))
    }

    ensureArguments() {
        // Nothing to do if all arguments are already specified
        if (this.definition.args <= (this.args || []).length)
            return

        // Mark as generated arguments, important for score
        this.argumentsGenerated = true
        this.args = []
        this.warnings.push('Insufficient call description')

        // Name the arguments A, B, C...
        for (var i = 0; i < this.definition.args; i++) {
            this.args.push({
                name: String.fromCharCode(65 + i)
            })
        }
    }

    type() {
        return "dynamic"
    }

}

module.exports = DynamicPredicate

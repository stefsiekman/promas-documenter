const Predicate = require('./predicate')

class DynamicPredicate extends Predicate {

    constructor(name, text) {
        super(name, text)

        this.definition = {
            name: this.nameString(),
            args: this.argCount()
        }

        // Try to find a definition in the comments
        var defString = text.match(
            new RegExp(this.definition.name + 
                '\\(([A-Z][a-zA-Z]+,\\s*){' + (this.definition.args - 1) +
                '}([A-Z][a-zA-Z]+){1}\\)'))

        if (defString) {
            var string = defString[0]

            // Remove the definition string from the text
            var textArray = this.text.split('')
            textArray.splice(defString.index, string.length)
            this.text = textArray.join('')

            super.argNamesFrom(string)

            console.log("Read arguments", this.args)
        }

    }

    nameString() {
        return this.name.substring(0, this.name.indexOf('/'))
    }

    argCount() {
        return +(this.name.substring(this.name.indexOf('/') + 1))
    }

}

module.exports = DynamicPredicate

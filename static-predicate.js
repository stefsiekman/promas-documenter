const Predicate = require('./predicate')

class StaticPredicate extends Predicate {

    constructor(name, text) {
        super(name, text)

        this.definition = {
            name: this.nameString(),
            args: this.argCount()
        }
    }

    nameString() {
        return this.name.substring(0, this.name.indexOf('('))
    }

    argCount() {
        var regexResult = this.name.match(/[A-Z]+[a-zA-Z]+(?!.*\()/g)
        return regexResult.length
    }

}

module.exports = StaticPredicate


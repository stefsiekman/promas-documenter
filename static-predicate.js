const Predicate = require('./predicate')

class StaticPredicate extends Predicate {

    constructor(name, text, file, line) {
        super(name, text, file, line)
        super.argNamesFrom(name, true)

        this.definition.name = this.nameString()
    }

    nameString() {
        return this.name.substring(0, this.name.indexOf('('))
    }

}

module.exports = StaticPredicate


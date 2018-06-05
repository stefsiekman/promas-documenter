const Predicate = require('./predicate')

class DynamicPredicate extends Predicate {

    constructor(name, text) {
        super(name, text)
        this.definition = {
            name: this.nameString(),
            args: this.argCount()
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

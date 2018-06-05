const Predicate = require('./predicate')

class StaticPredicate extends Predicate {

    constructor(name, text) {
        super(name, text)
    }

}

module.exports = StaticPredicate


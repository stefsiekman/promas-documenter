const Predicate = require('./predicate')

class DynamicPredicate extends Predicate {

    constructor(name, text) {
        super(name, text)
    }

}

module.exports = DynamicPredicate

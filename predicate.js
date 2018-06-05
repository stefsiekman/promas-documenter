class Predicate {

    constructor(name, text) {
        this.name = name
        this.text = text
    }

    score() {
        return this.text.length
    }

    equals(other) {
        if (!this.definition || !other.definition)
            return false

        return this.definition.name === other.definition.name &&
            this.definition.args === other.definition.args
    }

    niceName() {
        if (this.definition)
            return this.definition.name + '/' + this.definition.args

        return this.name
    }

}

module.exports = Predicate

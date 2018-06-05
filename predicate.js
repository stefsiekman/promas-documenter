class Predicate {

    constructor(name, text) {
        this.name = name
        this.text = text
    }

    score() {
        var score = this.text.length

        if (this.args) {
            score += 5000
        }

        return score
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

    argNamesFrom(string) {
        this.args = []
        for (var arg of string.match(/[A-Z]+[a-zA-Z]+(?!.*\()/g)) {
            this.args.push({
                name: arg
            })
        }
    }


}

module.exports = Predicate

const PrologCollection = require('./prolog-collection')

const config = require("./config")

var collection = new PrologCollection(config)
collection.analyze()
collection.removeDuplicates()

/*
for (var predicate of collection.predicates) {
    console.log(predicate.niceName())
    console.log(predicate.args)
}
*/


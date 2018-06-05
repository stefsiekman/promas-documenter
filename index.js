const PrologCollection = require('./prolog-collection')

const config = require("./config")

var collection = new PrologCollection(config)
collection.analyze()

if (collection.printWarnings()) {
    console.error('Exiting...')
    process.exit(1)
}

collection.write()

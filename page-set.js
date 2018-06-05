const Page = require('./page')

class PageSet {

    constructor(folder) {
        this.folder = folder
        this.pages = {}
    }

    addPredicate(predicate) {
        var name = predicate.pageName()

        // Create a new page if required
        if (!this.pages[name]) {
            this.pages[name] = new Page(name)
        }

        this.pages[name].predicates.push(predicate)
    }

}

module.exports = PageSet

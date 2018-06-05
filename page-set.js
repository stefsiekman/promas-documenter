const Page = require('./page')

class PageSet {

    constructor(folder) {
        this.folder = folder
        this.pages = []
    }

    addPredicate(predicate) {
        var name = predicate.pageName()

        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].name === name) {
                this.pages[i].predicates.push(predicate)
                return
            }
        }

        // Create a new page if required
        var page = new Page(name)
        page.predicates.push(predicate)
        this.pages.push(page)
    }

}

module.exports = PageSet

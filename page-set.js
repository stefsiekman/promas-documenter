const fs = require('fs')
const path = require('path')
const Page = require('./page')

class PageSet {

    constructor(folder) {
        this.folder = folder
        this.pages = []
    }

    write(folder) {
        // TODO: write the index

        for (var page of this.pages) {
            this.writePage(folder, page)
        }
    }

    writePage(folder, page) {
        var pagePath = path.join(folder, this.folder, page.filename())

        // Create a backup if the file will be replaced
        if (fs.existsSync(pagePath)) {
            var backupNumber = 1
            var backupPath = path.join(folder, this.folder, 
                page.backupFilename(backupNumber))

            while (fs.existsSync(backupPath))
                backupPath = path.join(folder, this.folder, 
                    page.backupFilename(++backupNumber))

            fs.renameSync(pagePath, backupPath)
        }

        fs.writeFileSync(pagePath, page.text(this.folder))
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

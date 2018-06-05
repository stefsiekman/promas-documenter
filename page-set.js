const fs = require('fs')
const path = require('path')
const moment = require('moment')
const Page = require('./page')

class PageSet {

    constructor(folder) {
        this.folder = folder
        this.pages = []
    }

    write(folder) {
        // Remove the old markdown files
        var folderPath = path.join(folder, this.folder)
        for (var file of fs.readdirSync(folderPath))
            if (file.endsWith('.md'))
                fs.unlinkSync(path.join(folderPath, file))

        this.writeIndexFile(folder)

        for (var page of this.pages) {
            this.writePage(folder, page)
        }
    }

    writeIndexFile(folder) {
        var md = '[&laquo; Back](documentation/documentation)\n\n'
        
        for (var page of this.pages) {
            md += ` - [${page.predicates[0].definition.name}]`
            md += `(documentation/${this.folder}/${page.name})\n`
        }

        md += '\n'

        md += 'These pages were generated using the [promas documenter tool]'
        md += '(https://github.com/stefsiekman/promas-documenter) on '
        md += moment().format("dddd, Do MMMM YYYY, HH:mm:ss") + '.\n\n'

        var indexPath = path.join(folder, this.folder, this.folder + '.md')
        fs.writeFileSync(indexPath, md)
    }

    writePage(folder, page) {
        var pagePath = path.join(folder, this.folder, page.filename())
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

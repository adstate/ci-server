const path = require('path');
const fs = require('fs');

class LogCache {
    constructor() {
        this.duration = 10 * 60 * 1000;
        this.dir = './var/cache';

        if (!fs.existsSync(this.dir)) {
            fs.mkdir(this.dir, (err) => {
                console.log('Error of creating cache folder', err);
            });
        }
    }

    addItem(buildId) {        
        return fs.createWriteStream(this.getItemPath(buildId));
    }

    getValidItem(buildId) {
        if (!fs.existsSync(this.getItemPath(buildId))) {
            return null;
        }

        console.log('item is not exist');

        if (this.validateItem(buildId)) {
            return fs.createReadStream(this.getItemPath(buildId));
        } else {
            this.deleteItem(buildId);
            return null;
        }
    }

    validateItem(buildId) {
        const stat = fs.statSync(this.getItemPath(buildId));
        const currentDate = new Date();
        const duration = currentDate - stat.ctime;

        return (duration < this.duration);
    }

    deleteItem(buildId) {
        fs.unlinkSync(this.getItemPath(buildId));
    }

    getItemPath(buildId) {
        return path.join(this.dir, `${buildId}.log`)
    }

}

module.exports = new LogCache();
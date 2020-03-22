const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const util = require('util');
const config = require('../config');

const emptyDir = util.promisify(fsExtra.emptyDir);
const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

class LogCache {
    constructor(opts) {
        opts = opts || {};

        this.duration = opts.duration || 20 * 60 * 1000;
        this.dir = opts.dir || './var/cache';

        if (!fs.existsSync(this.dir)) {
            mkdir(this.dir).catch((err) => {
                console.error('CACHE:Error of creating cache folder', err);
            });
        } else if (opts.clearCacheOnStart) {
            this.clear();
        }

        setInterval(this.clearExpired.bind(this), this.duration);
    }

    addItem(buildId) {
        return fs.createWriteStream(this.getItemPath(buildId));
    }

    getValidItem(buildId) {
        if (!fs.existsSync(this.getItemPath(buildId))) {
            return null;
        }

        if (this.validateItem(buildId)) {
            return fs.createReadStream(this.getItemPath(buildId));
        }
        this.deleteItem(`${buildId}.log`);
        return null;
    }

    validateItem(buildId) {
        const stats = fs.statSync(this.getItemPath(buildId));
        const currentDate = new Date();

        return (currentDate - stats.ctime < this.duration);
    }

    deleteItem(fileName) {
        unlink(path.join(this.dir, fileName)).catch((err) => {
            console.error('CACHE:Error of deleting cache item', err);
        });
    }

    getItemPath(buildId) {
        return path.join(this.dir, `${buildId}.log`);
    }

    clear() {
        emptyDir(this.dir).catch((err) => {
            console.error('CACHE:Error of clear cache', err);
        });
    }

    clearExpired() {
        readdir(this.dir)
            .then((files) => {
                const currentDate = new Date();

                files.forEach((file) => {
                    stat(path.join(this.dir, file)).then((stats) => {
                        if (currentDate - stats.ctime > this.duration) {
                            this.deleteItem(file);
                        }
                    });
                });
            })
            .catch((err) => {
                console.error('CACHE:clearExpired - Can not read cache log directory');
            });
    }
}

module.exports = new LogCache({
    clearCacheOnStart: true,
    duration: config.CACHE_LIFESPAN,
});

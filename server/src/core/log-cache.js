const crypto = require('crypto');

// все кейсы не успел протестировать
class LogCache {
    constructor(opts) {
        this.limit = 5;
        this.duration = 5 * 60 * 1000;
        this.stack = [];
        this.items = {}; // key is buildId
    }

    addItem(buildId, log) {
        if (this.getItem(buildId)) {
            this.items[buildId] = this.createItem(log);
        } else {
            if (this.stack.length >= this.limit) {
                this.deleteLastItem();
            }

            this.items[buildId] = this.createItem(log);
            this.stack.push(buildId);
        }
    }

    deleteLastItem() {
        const lastBuildId = this.stack.shift();
        delete this.items[lastBuildId];
    }

    deleteItem(buildId) {
        delete this.items[buildId];
        this.stack.splice(this.stack.indexOf(buildId), 1);
    }

    createItem(log) {
        let hash = crypto.createHash('md5').update(log).digest("hex");

        return {
            hash: hash,
            log: log,
            time: new Date(),
            expired: false
        }
    }

    getItem(buildId) {
        return this.items[buildId];
    }

    getValidItem(buildId) {
        const item = this.getItem(buildId);

        if (!item) {
            return null;
        }

        if (this.validateItem(item)) {
            return item;
        } else {
            this.deleteItem(buildId);

            return null;
        }
    }

    validateItem(item) {
        const currentDate = new Date();
        const duration = currentDate - item.time;

        return (duration < this.duration);
    }

}

module.exports = new LogCache();
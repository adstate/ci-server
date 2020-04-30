import path from 'path';
import fs, {WriteStream, ReadStream} from 'fs';
import fsExtra from 'fs-extra';
import util from 'util';
import config from '../config';

const emptyDir = util.promisify(fsExtra.emptyDir);
const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const exists = util.promisify(fs.exists);

class LogCache {
    duration: number;
    dir: string;
    clearCacheOnStart: boolean;

    constructor(opts: {
        duration?: number,
        dir?: string;
        clearCacheOnStart?: boolean
    }) {
        opts = opts || {};

        this.duration = opts.duration || 20 * 60 * 1000;
        this.dir = opts.dir || './var/cache';
        this.clearCacheOnStart = opts.clearCacheOnStart || false;

        this.init();
    }

    async init() {
        const varFolder = './var';

        if (!await exists(varFolder)) {
            try {
                mkdir(varFolder);
            } catch(e) {
                console.error('Error of creating var folder', e);
            }
        }

        if (!await exists(this.dir)) {
            mkdir(this.dir, {recursive: true}).catch((err) => {
                console.error('CACHE:Error of creating cache folder', err);
            });
        } else if (this.clearCacheOnStart) {
            this.clear();
        }

        setInterval(this.clearExpired.bind(this), this.duration);
    }

    addItem(buildId: string): WriteStream {
        return fs.createWriteStream(this.getItemPath(buildId));
    }

    async getValidItem(buildId: string): Promise<ReadStream | null> {
        if (!await exists(this.getItemPath(buildId))) {
            return null;
        }

        if (await this.validateItem(buildId)) {
            return fs.createReadStream(this.getItemPath(buildId));
        }
        this.deleteItem(`${buildId}.log`);

        return null;
    }

    async validateItem(buildId: string): Promise<boolean> {
        const stats = await stat(this.getItemPath(buildId));
        const currentDate = new Date();

        return (currentDate.getTime() - stats.ctime.getTime() < this.duration);
    }

    deleteItem(fileName: string): void {
        unlink(path.join(this.dir, fileName)).catch((err) => {
            console.error('CACHE:Error of deleting cache item', err);
        });
    }

    getItemPath(buildId: string) {
        return path.join(this.dir, `${buildId}.log`);
    }

    clear() {
        emptyDir(this.dir).catch((err) => {
            console.error('CACHE:Error of clear cache', err);
        });
    }

    clearExpired() {
        readdir(this.dir)
            .then((files: string[]) => {
                const currentDate = new Date();

                files.forEach((file: string) => {
                    stat(path.join(this.dir, file)).then((stats) => {
                        if (currentDate.getTime() - stats.ctime.getTime() > this.duration) {
                            this.deleteItem(file);
                        }
                    });
                });
            })
            .catch((err: any) => {
                console.error('CACHE:clearExpired - Can not read cache log directory');
            });
    }
}

export default new LogCache({
    clearCacheOnStart: true,
    duration: config.CACHE_LIFESPAN,
});

export default class Commit {
    hash: any;
    author: any;
    message: any;
    
    constructor(opts: any) {
        this.hash = opts.hash;
        this.author = opts.author;
        this.message = opts.message;
    }
};


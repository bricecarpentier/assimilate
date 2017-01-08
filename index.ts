"use strict";

import { GithubPlugin } from "./plugins/github_plugin";
import stream = require('stream');

class Runner extends stream.Writable {
    constructor() {
        super({objectMode: true});
    }

    _write(chunk, encoding, callback) {
        console.log('== chunk arrived');
        callback();
    }
}

var gh:GithubPlugin = new GithubPlugin({type: 'token', token: process.argv[2]})
var runner:Runner = new Runner();
gh.pipe(runner);
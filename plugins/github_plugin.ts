import * as events from "events";
import { MixinApplier } from "../lib/mixins";
import { CommandDefinition } from "../lib/plugins";
import { Timer } from "../timer";

import Github = require("github");
import stream = require("stream");

export class GithubPlugin extends stream.Readable  {
    /* defaults to 60
    * later updated depending on github */
    static DEFAULT_POLLING_INTERVAL: number = 60;

    static DATA: symbol = Symbol('data');

    dispatcher: events.EventEmitter = new events.EventEmitter();
    notifications: any[] = [];
    client: Github;
    timer: Timer;

    constructor(opt:any) {
        super({objectMode: true});

        this.client = new Github();
        this.client.authenticate({
            type: opt.type,
            token: opt.token});
        this._startPolling();
        this.dispatcher.addListener(GithubPlugin.DATA, () => {this._onData()});
    }

    _read(size) {
        console.log('>> _read');
    }

    _startPolling() {
        this.timer = new Timer(GithubPlugin.DEFAULT_POLLING_INTERVAL);
        this.timer.addListener(Timer.TICK, () => {this._poll()});
        this._poll();
    }

    _poll() {
        console.log('>> _poll');
        this.client.activity.getNotifications({}).then(notifications => {
            this.timer.interval = parseInt(notifications.meta['x-poll-interval'], 10);
            if (notifications.length) {
                this.notifications = this.notifications.concat(notifications);
                this.dispatcher.emit(GithubPlugin.DATA);
            }
        })
    }

    _onData() {
        while (this.notifications.length) {
            let chunk = this.notifications.shift();
            console.log('pushing');
            this.push(chunk);
            console.log('pushed');
        }
    }

}

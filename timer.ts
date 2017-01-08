import * as events from "events";


export class Timer extends events.EventEmitter {
    static TICK:symbol = Symbol('TICK');

    _timer: NodeJS.Timer = null;

    _interval: number;
    get interval() : number {return this._interval;}
    set interval(value:number) {
        if (this._interval == value) return;

        this._interval = value;
        this.start();
    }

    constructor(interval:number) {
        super();
        this._interval = interval;
        this.start();
    }

    _tick() {
        this.emit(Timer.TICK);
    }

    start() {
        this.stop();
        this._timer = setInterval(() => {this._tick()}, this._interval * 1000);
    }

    stop() {
        if (this._timer == null) return;

        this._timer.unref();
        this._timer = null;
    }

}
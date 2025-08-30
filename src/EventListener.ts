import type {default as Event, Callback} from "./Event";

export type EventListenerOpts = {
    ack : boolean,
    once: boolean
    //TODO initial (?)
};

export const NULL_CALLBACK = () => {};

//TODO: source (really used ?)
export default class EventListener {

    #source  : Event|null;
    #callback: Callback;

    #eventCallback = () => this.trigger();

    constructor(src     : Event|null = null,
                callback: Callback   = NULL_CALLBACK,
                {
                    ack  = false,
                    once = false
                }: Partial<EventListenerOpts> = {}) {

        this.#callback = callback;
        this.#opts     = {ack, once};

        this.#source = src;
        if( src !== null)
            src.listen(this.#eventCallback);
    }

    #opts : EventListenerOpts;

    trigger() {

        if( this.#opts.ack && this.#pending )
            return;

        // must be called once to be removed.
        if( this.#opts.once && this.#source !== null )
            this.#source.unlisten(this.#eventCallback);

        this.#pending = true;
        this.#callback();
    }

    #pending = false;
    get pending() {
        return this.#pending;
    }

    ack() {
        this.#pending = false;
    }

}
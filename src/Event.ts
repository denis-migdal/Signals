import {createGraphNode, appendGraphNode, removeGraphNode} from "./GraphNode";
import LinkedList from "./LinkedList";

export type Callback = () => void;

export default class Event {

    readonly name: string|null;

    readonly #callbacks  = new LinkedList<Callback>();
    readonly #subscribed = new LinkedList<Event>();

    constructor(name: string|null = null, ...events: Event[]) {
        this.name   = name;

        this.subscribeTo(...events);
    }

    // TODO: unsubscribe.
    subscribeTo(...events: Event[]) {

        for(let i = 0; i < events.length; ++i)
            events[i].#subscribed.append(this);

        return this;
    }
    unsubscribeFrom(...events: Event[]) {

        for(let i = 0; i < events.length; ++i)
            events[i].#subscribed.remove(this);

        return this;
    }

    listen(callback: Callback) {
        this.#callbacks.append(callback);

        return this;
    }

    unlisten(callback: Callback) {
        this.#callbacks.remove(callback);

        return this;
    }

    #call() {
        let cur = this.#callbacks.firstElement;
        while(cur !== null) {
            cur.content!();
            cur = this.#callbacks.nextSibling(cur);
        }
    }

    trigger() {

        this.#call();

        let cur = this.#subscribed.firstElement;

        while(cur !== null) {
            cur.content!.trigger(); //TODO
            cur = this.#subscribed.nextSibling(cur);
        }

        return this;
    }
}
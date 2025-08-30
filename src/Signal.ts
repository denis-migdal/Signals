import Event from "./Event"

export default class Signal<IN, OUT> extends Event {

    //TODO: trigger if source change, only if valueIsKnown && diff from previous...

    #value: OUT|null = null; // undefined for unknown ? OR value status ?
    get value() {
        //TODO: compute if value is not known...
        return this.#value;
    }
    // value (get/set)
    // input (set)
    // transform (or another class ?)
    /*
    override get source(): Signal<any, IN>|null {
        return super.source as Signal<any, IN>;
    }/*
    override set source(src: Signal<any, IN>|null) {
        super.source = src;
    }*/
}
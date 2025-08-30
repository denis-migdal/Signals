import {default as EventListener, EventListenerOpts, NULL_CALLBACK} from "./EventListener";
import type Signal        from "./Signal";
import type {Callback}    from "./Event";

export default class SignalListener<OUT> extends EventListener {

    constructor(src     : Signal<any, OUT>|null = null,
                callback: Callback   = NULL_CALLBACK,
                {
                    ack  = true,
                    once = false
                }: Partial<EventListenerOpts> = {}) {

        super(src, callback, {ack, once});
    }

    //TODO: get value = ack...
}
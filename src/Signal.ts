import {default as ROSignal, SignalCallback} from "./ROSignal";

export default class Signal<T> extends ROSignal<T> {

    #internalValue: T|null = null;
    #hasValue     : boolean = false;

    override get value(): T|null {
        if( this.parent === null)
            return this.#internalValue;
        return this.parent.value;
    }

    override get hasValue() {
        if( this.parent === null)
            return this.#hasValue;
        return this.parent.hasValue;
    }

    //TODO inputSource (null/src)
    set inputSource(src: Signal<T>|null) {

        /*if( this.notifyInProgress === true )
            throw new Error('Behavior Not Well Defined: setting input when root.notifyInProgress.');*/

        const hadValue = this.hasValue;

        this.setParent(src);
        this.#internalValue = null;

        // no need to trigger during setup.
        if( hadValue === false && this.hasValue === false )
            return;

        this.trigger();
    }

    set inputValue(value: T) {

        /*if( this.notifyInProgress === true )
            throw new Error('Behavior Not Well Defined: setting input when root.notifyInProgress.');*/

        if( this.parent !== null)
            this.setParent(null);

        this.#internalValue = value;
        this.#hasValue      = true;
        this.trigger();
    }
}
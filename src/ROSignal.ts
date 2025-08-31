export type SignalCallback<T> = (signal: ROSignal<T>) => void;

export default abstract class ROSignal<T> {

    readonly name: string|null;

    constructor(name: string|null = null) {
        this.name = name;
    }

    //#notifyInProgress            = false;
    #callbacks: SignalCallback<T>[] = [];

    /*get notifyInProgress() {
        return this.#notifyInProgress;
    }*/

    listen(callback: SignalCallback<T>) {

        /*if( this.#notifyInProgress === true )
            throw new Error('Behavior Not Well Defined: (un)listening when root.notifyInProgress.');*/
        
        this.#callbacks.push(callback);
        callback(this); // initial call.

        return this;
    }
    unlisten(callback: SignalCallback<T>) {

        /*if( this.#notifyInProgress === true )
            throw new Error('Behavior Not Well Defined: (un)listening when root.notifyInProgress.');*/

        const idx = this.#callbacks.lastIndexOf(callback);
        if( idx !== -1)
            this.#callbacks.splice(idx, 1);
        
        return this;
    }

    // tree.
    #children  : ROSignal<T>[]    = [];
    #parent    : ROSignal<T>|null = null;
    #prev      : ROSignal<T>|null = null;
    #next      : ROSignal<T>|null = null;

    protected get parent() {
        return this.#parent;
    }

    protected setParent(parent: ROSignal<T>|null) {

        let last: ROSignal<T> = this;
        while( last.#children.length !== 0)
            last = last.#children[last.#children.length-1];

        if( this.#parent !== null) {
            const idx = this.#parent.#children.indexOf(this);
            this.#parent.#children.splice(idx, 1);
            
            if( this.#prev !== null)
                this.#prev.#next = last.#next;
            if( last.#next !== null)
                last.#next.#prev = this.#prev;
        }

        // not parents.
        if( parent === null) {

            this.#prev   = null;
            last.#next   = null;
            this.#parent = null;
            
            return;
        }

        // new parent

        this.#parent = parent;

        let plast = this.#parent;
        while( plast.#children.length !== 0)
            plast = plast.#children[plast.#children.length-1]

        this.#parent.#children.push(this);

        last.#next = plast.#next;
        if( last.#next !== null)
            last.#next.#prev = last;
        
        plast.#next = this;
        this.#prev  = plast;
    }

    protected trigger() {

        //this.#notifyInProgress = true;

        for(let i = 0; i < this.#callbacks.length; ++i)
            this.#callbacks[i](this);

        let cur = this.#next;
        while( cur !== null) {
            for(let i = 0; i < cur.#callbacks.length; ++i)
                cur.#callbacks[i](this);
            cur = cur.#next;
        }

        //this.#notifyInProgress = false;

        return this;
    }

    abstract readonly value: T|null;
    abstract readonly hasValue: boolean;
}
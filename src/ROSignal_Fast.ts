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

        
        if( this.#callbacks.length === 0) {

            let cur: ROSignal<T> = this;
            if( cur.#prev !== null) { // else nextCallbacks infinite loop.

                cur = cur.#prev;
                while( cur.#prev !== null && cur.#callbacks.length === 0)
                    cur = cur.#prev;

                this.#nextCallbacks = cur.#nextCallbacks;
                cur.#nextCallbacks  = this;

                if( this.#nextCallbacks !== null)
                    this.#nextCallbacks.#prevCallbacks = this;
            }
        }

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

        if( this.#callbacks.length === 0) {
            //TODO: unregister node...
            throw new Error("not implemented !");
        }
        
        return this;
    }

    // tree.
    #children  : ROSignal<T>[]    = [];
    #parent    : ROSignal<T>|null = null;
    #prev      : ROSignal<T>|null = null;
    #next      : ROSignal<T>|null = null;

    #prevCallbacks: ROSignal<T>|null = null;
    #nextCallbacks: ROSignal<T>|null = null;

    protected get parent() {
        return this.#parent;
    }

    protected setParent(parent: ROSignal<T>|null) {

        // Not properly implemented for #next/prevCallbacks...

        let last: ROSignal<T> = this;
        while( last.#children.length !== 0)
            last = last.#children[last.#children.length-1];

        // search firstC/lastC
        let firstC: ROSignal<T>|null = this;
        let lastC : ROSignal<T>|null = null;
        while(firstC !== last.#next && firstC!.#callbacks.length === 0)
            firstC = firstC!.#next;
        if( firstC === last.#next)
            firstC = null;
        else { // search lastC...
            lastC = last;
            while(lastC !== firstC && lastC!.#callbacks.length === 0)
                lastC = lastC!.#prev;
        }

        if( this.#parent !== null) {
            const idx = this.#parent.#children.indexOf(this);
            this.#parent.#children.splice(idx, 1);

            // remove...
            if( firstC !== null) {
                if( firstC.#prevCallbacks !== null )
                    firstC.#prevCallbacks.#nextCallbacks = lastC!.#nextCallbacks;
                if( lastC!.#nextCallbacks !== null )
                    lastC!.#nextCallbacks.#prevCallbacks = firstC.#prevCallbacks;
            }

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

            this.#nextCallbacks   = firstC;

            if( firstC !== null) {
                firstC.#prevCallbacks = null;
                lastC!.#nextCallbacks = null;
            }
            
            return;
        }

        // new parent
        this.#parent = parent;

        let plast = this.#parent;
        while( plast.#children.length !== 0)
            plast = plast.#children[plast.#children.length-1]

        // callbacks
        if( firstC !== null) {
            let plastC = plast;
            while( plastC.#prev !== null && plastC.#children.length === 0)
                plastC = plastC.#prev;

            let nextC = plastC.#nextCallbacks;

            plastC.#nextCallbacks = firstC;
            firstC.#prevCallbacks = plastC;

            lastC!.#nextCallbacks = nextC;
            if( nextC !== null)
                nextC.#prevCallbacks = lastC;
        }


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

        let cur = this.#nextCallbacks;
        while( cur !== null ) {
            for(let i = 0; i < cur.#callbacks.length; ++i)
                cur.#callbacks[i](this);
            cur = cur.#nextCallbacks;
        }
/*
        let cur = this.#next;
        while( cur !== null) {
            for(let i = 0; i < cur.#callbacks.length; ++i)
                cur.#callbacks[i](this);
            cur = cur.#next;
        }*/

        //this.#notifyInProgress = false;

        return this;
    }

    abstract readonly value: T|null;
    abstract readonly hasValue: boolean;
}
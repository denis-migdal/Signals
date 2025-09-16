export type SignalCallback<T> = (signal: ROSignal<T>) => void;

type CallbackNode<T> = {
    prev: CallbackNode<T>|null,
    next: CallbackNode<T>|null,
    content: SignalCallback<T>,
    parent : ROSignal<T>
}

export default abstract class ROSignal<T> {

    readonly name: string|null;

    abstract readonly value: T|null;
    abstract readonly hasValue: boolean;

    constructor(name: string|null = null) {
        this.name = name;
    }

    //TODO: rename ?
    private selfFirstCallback: CallbackNode<T>|null = null;
    private selfLastCallback : CallbackNode<T>|null = null;
    private rootFirstCallback: CallbackNode<T>|null = null;
    private rootLastCallback : CallbackNode<T>|null = null;

    // listen/unlisten

    listen(callback: SignalCallback<T>) {
    
        const callbackNode: CallbackNode<T> = {
            prev: null,
            next: null,
            content: callback,
            parent : this
        }

        //TODO: if root.cur !== null -> delay

        // update self callbacks (no needs for saves)
        if( this.selfLastCallback === null )
            this.selfFirstCallback = callbackNode;
        this.selfLastCallback = callbackNode;

        if( this.rootLastCallback === null) {// absolutely no callbacks.

            this.rootFirstCallback = this.rootLastCallback = callbackNode;

            // search insertion point.
            let cur = this.prev;
            while( cur !== null && cur.rootLastCallback === null)
                cur = cur.prev;
            
            if( cur !== null ) {
                callbackNode.prev = cur.rootLastCallback!;
                callbackNode.next = cur.rootLastCallback!.next;
                cur.rootLastCallback!.next = callbackNode;
                if( callbackNode!.next !== null )
                    callbackNode!.next.prev = callbackNode;
            }

            //TODO: propagate firstRoot

        } else {

            callbackNode.prev = this.rootLastCallback;
            callbackNode.next = this.rootLastCallback.next;
            this.rootLastCallback = this.rootLastCallback.next = callbackNode;

            //TODO: update ancestors
            throw new Error("not implemented !");
        }

        // update ancestors rootLastCallback
        const prevLast = callbackNode.prev;
        let curAncestor = this.parent;
        while(curAncestor !== null
                && (   curAncestor.rootLastCallback === null
                    || curAncestor.rootLastCallback === prevLast) ) {

            curAncestor.rootLastCallback = callbackNode;
            curAncestor = curAncestor.parent;
        }

        // update ancestors rootFirstCallback
        const prevFirst = callbackNode.next;
        curAncestor = this.parent;
        while(curAncestor !== null
                && (   curAncestor.rootFirstCallback === null
                    || curAncestor.rootFirstCallback === prevFirst) ) {

            curAncestor.rootFirstCallback = callbackNode;
            curAncestor = curAncestor.parent;
        }

        callback(this); // initial call.

        return this;
    }
    unlisten(callback: SignalCallback<T>) {
        throw new Error("Not implemented yet");
        return this;
    }

    // trigger

    private curCallback: CallbackNode<T>|null = null;
    protected trigger() {

        // no callback to call.
        if( this.rootFirstCallback === null )
            return;

        this.curCallback = this.rootFirstCallback;
        while( this.curCallback !== this.rootLastCallback ) {
            this.curCallback!.content(this);
            this.curCallback = this.curCallback!.next;
        }

        return this;
    }

    // change parent...

    protected parent  : ROSignal<T>|null = null;
    private firstChild: ROSignal<T>|null = null;
    private lastChild : ROSignal<T>|null = null;
    private next      : ROSignal<T>|null = null;
    private prev      : ROSignal<T>|null = null;


    // Poorly implemented...
    protected setParent(parent: ROSignal<T>|null) {

        if(this.parent !== null) {
            //TODO: remove...
            throw new Error("not implemented");
        }

        if( parent === null) {
            throw new Error("not implemented");
            //TODO: set all to null...
            return;
        }

        this.parent = parent;
        if( parent.lastChild === null) {
            parent.firstChild = parent.lastChild = this;
        } else {
            this.prev = parent.lastChild;
            parent.lastChild = parent.lastChild.next = this;
        }

        if( this.rootLastCallback !== null ) {

            const last = parent.rootLastCallback; // necessary the last.
            parent.rootLastCallback = this.rootLastCallback;
            this.propagateRootLastCallback(parent.parent, last,
                                            this.rootLastCallback);

            const first = parent.rootFirstCallback;
            if( first === null ) {
                parent.rootFirstCallback = this.rootFirstCallback;
                this.propagateRootFirstCallback(parent.parent, first,
                                                this.rootFirstCallback);
            }
        }
    }

    private propagateRootFirstCallback(target: ROSignal<T>|null,
                                        cur  : CallbackNode<T>|null,
                                        value: CallbackNode<T>|null) {

        //TODO: more complex...
        while( target !== null && target.rootFirstCallback === cur ) {
            target.rootFirstCallback = value;
            target = target.parent;
        }
    }
    private propagateRootLastCallback(target: ROSignal<T>|null,
                                       cur  : CallbackNode<T>|null,
                                       value: CallbackNode<T>|null) {

        //TODO: more complex...
        while( target !== null && target.rootLastCallback === cur ) {
            target.rootLastCallback = value;
            target = target.parent;
        }
    }
}


export type SignalCallback<T> = (signal: ROSignal<T>) => void;

export default abstract class ROSignal<T> {

    readonly name: string|null;

    abstract readonly value: T|null;
    abstract readonly hasValue: boolean;

    constructor(name: string|null = null) {
        this.name = name;
    }

    #callbacks: SignalCallback<T>[] = [];

    listen(callback: SignalCallback<T>) {

        this.#callbacks.push(callback);

        callback(this); // initial call.

        return this;
    }
    unlisten(callback: SignalCallback<T>) {

        const idx = this.#callbacks.lastIndexOf(callback);
        if( idx !== -1)
            this.#callbacks.splice(idx, 1);
        
        return this;
    }

    // tree.
    #children  : ROSignal<T>[]    = [];
    #parent    : ROSignal<T>|null = null;

    protected get parent() {
        return this.#parent;
    }

    protected setParent(parent: ROSignal<T>|null) {

        if(this.#parent !== null) {
            const idx = this.#parent.#children.indexOf(this);
            this.#parent.#children.splice(idx, 1);
        }

        this.#parent = parent;
        if( this.#parent !== null ) {
            this.#parent.#children.push(this);
        }
    }

    protected trigger(root: ROSignal<T> = this) {

        for(let i = 0; i < this.#callbacks.length; ++i)
            this.#callbacks[i](root);

        for(let i = 0; i < this.#children.length; ++i)
            this.#children[i].trigger(root);

        return this;
    }
}
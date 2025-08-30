// Can't put in pool as we may still use it after being removed.
export type ListNode<T> = {
    content    : T|null,
    nextSibling: ListNode<T>|null,
    prevSibling: ListNode<T>|null,
}

export default class LinkedList<T> {
    firstElement: ListNode<T>|null = null;
    lastElement : ListNode<T>|null = null;

    append(content: T) {
        const node: ListNode<T> = {
            content,
            nextSibling: null,
            prevSibling: null
        }

        if( this.lastElement === null ) {
            this.lastElement = this.firstElement = node;
            return;
        }

        node.prevSibling = this.lastElement;
        this.lastElement = this.lastElement.nextSibling = node;
    }

    // could be optimized if Listener is a node itself ?
    remove(content: T) {

        if( this.firstElement === null)
            return; // empty list.

        let found: ListNode<T>|null = null;

        // is first elem
        if( this.firstElement!.content === content ) {
            found = this.firstElement!;
            this.firstElement = found.nextSibling;
        }
        // is last elem
        if( this.lastElement!.content === content ) {
            found = this.lastElement!;
            this.lastElement = found.prevSibling;
        }

        // else search in list
        if( found === null) {
            let cur = this.firstElement!.nextSibling;
            while(cur !== null && cur.content !== content)
                cur = cur.nextSibling;

            found = cur;
        }

        if( found === null ) // not found.
            return;

        // update list.
        found.content = null; // mark as orphan.
        if( found.prevSibling !== null)
            found.prevSibling.nextSibling = found.nextSibling;
        if( found.nextSibling !== null)
            found.nextSibling.prevSibling = found.prevSibling;
    }

    // cur may have been removed from the list.
    // but no worry
    nextSibling(cur: ListNode<T>|null) {
        while( cur !== null && cur.content === null) // was removed
            cur = cur.prevSibling;
        if( cur === null ) // all were removed.
            cur = this.firstElement;
        else
            cur = cur.nextSibling;

        return cur;
    }
}
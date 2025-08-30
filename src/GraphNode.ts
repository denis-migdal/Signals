export type GraphNode<T> = {
    content    : T,
    prevSibling: GraphNode<T>|null,
    nextSibling: GraphNode<T>|null,
    parent     : GraphNode<T>|null,
    firstChild : GraphNode<T>|null,
    lastChild  : GraphNode<T>|null, 
}

export function createGraphNode<T>(content: T): GraphNode<T> {
    return {
        content,
        prevSibling: null,
        nextSibling: null,
        parent     : null,
        firstChild : null,
        lastChild  : null, 
    }
}

// child must not have a parent (remove it before)
export function appendGraphNode<T>(parent: GraphNode<T>, child: GraphNode<T>) {

    child.parent = parent;

    if( parent.lastChild === null) {
        parent.firstChild = parent.lastChild = child;
        return;
    }
    
    parent.lastChild = parent.lastChild.nextSibling = child;
}

export function removeGraphNode<T>(parent: GraphNode<T>, child: GraphNode<T>) {

    if( child.parent !== parent )
        return;

    if( parent.lastChild === child ) { // child.nextSibling == null
        parent.lastChild = child.prevSibling;
    } else {
        child.nextSibling!.prevSibling = child.prevSibling;
    }

    if( parent.firstChild === child ) { // child.prevSibling == null
        parent.firstChild = child.nextSibling;
    } else {
        child.prevSibling!.nextSibling = child.nextSibling;
    }

    child.nextSibling = child.prevSibling = null;
}
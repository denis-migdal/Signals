import {it, describe} from "jsr:@std/testing/bdd";
import { assert } from "jsr:@std/assert";

import Event         from "../src/Event";
import EventListener from "../src/EventListener";

const tests = describe("EventListener", {
                            sanitizeResources: false,
                            sanitizeOps      : false
                    }); // beforeAll / afterAll

it(tests, "simple no trigger", async () => {

    let triggered = false;

    const ev = new Event();
    const l  = new EventListener(ev, () => triggered = true);

    assert( ! triggered);
});

it(tests, "simple trigger", async () => {

    let triggered = false;

    const ev = new Event();
    const l  = new EventListener(ev, () => triggered = true);
    ev.trigger();

    assert( triggered);
});

it(tests, "trigger before event", async () => {

    let triggered = false;

    const ev = new Event();
    ev.trigger();
    const l  = new EventListener(ev, () => triggered = true);

    assert( ! triggered); // we do not listen past events.
});


it(tests, "trigger once", async () => {

    let count = 0;

    const ev = new Event();
    const l  = new EventListener(ev, () => ++count, {once: true});
    ev.trigger();
    l.ack();
    ev.trigger();

    assert( l.pending === false );
    assert( count === 1 ); // we do not listen past events.
});
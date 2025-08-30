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

    const l = new EventListener(null, () => triggered = true);

    assert( ! triggered);
});

it(tests, "simple trigger", async () => {

    let triggered = false;

    const l = new EventListener(null, () => triggered = true);
    l.trigger();

    assert(triggered);
});

it(tests, "trigger count", async () => {

    let count = 0;

    const l = new EventListener(null, () => ++count);
    l.trigger();
    l.trigger();

    assert(count === 2);
});

it(tests, "trigger count (ack)", async () => {

    let count = 0;

    const l = new EventListener(null, () => ++count, {ack: true});
    l.trigger();
    l.trigger();

    assert(count === 1);
});

it(tests, "trigger count (ack+ack)", async () => {

    let count = 0;

    const l = new EventListener(null, () => ++count, {ack: true});
    l.trigger();
    l.ack();
    l.trigger();

    assert(count === 2);
});
import {it, describe} from "jsr:@std/testing/bdd";
import { assert } from "jsr:@std/assert";

import SignalListener from "../src/SignalListener";

const tests = describe("SignalListener", {
                            sanitizeResources: false,
                            sanitizeOps      : false
                    }); // beforeAll / afterAll

it(tests, "simple no trigger", async () => {

    let triggered = false;

    const l = new SignalListener(null, () => triggered = true);

    assert( ! triggered);
});


it(tests, "simple trigger", async () => {

    let triggered = false;

    const l = new SignalListener(null, () => triggered = true);
    l.trigger();

    assert(triggered);
});

it(tests, "trigger count (no ack)", async () => {

    let count = 0;

    const l = new SignalListener(null, () => ++count);
    l.trigger();
    l.trigger();

    assert(count === 1);
});


it(tests, "trigger count (ack)", async () => {

    let count = 0;

    const l = new SignalListener(null, () => ++count);
    l.trigger();
    l.ack();
    l.trigger();

    assert(count === 2);
});
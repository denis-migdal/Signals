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

    const ev1 = new Event();
    const ev2 = new Event(null, ev1)
    const l  = new EventListener(ev2, () => triggered = true);

    assert( ! triggered);
});

it(tests, "simple trigger", async () => {

    let triggered = false;

    const ev1 = new Event();
    const ev2 = new Event(null, ev1);
    const l  = new EventListener(ev2, () => triggered = true);
    ev1.trigger();

    assert( triggered);
});

it(tests, "trigger intermediaire", async () => {

    let triggered = false;

    const ev1 = new Event();
    const ev2 = new Event(null, ev1);
    const l  = new EventListener(ev2, () => triggered = true);
    ev2.trigger();

    assert( triggered);
});
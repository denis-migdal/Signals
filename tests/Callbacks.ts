import {it, describe} from "jsr:@std/testing/bdd";
import { assert } from "jsr:@std/assert";

import Event         from "../src/Event";
import EventListener from "../src/EventListener";

const tests = describe("Callbacks", {
                            sanitizeResources: false,
                            sanitizeOps      : false
                    }); // beforeAll / afterAll

it(tests, "simple", async () => {

    let count = 0;

    const c1 = () => { ++count };
    const c2 = () => { ++count };
    const c3 = () => { ++count };

    const ev = new Event();
    ev.listen(c1)
      .listen(c2)
      .listen(c3)
      .trigger();

    assert( count === 3);
});


it(tests, "remove in callback", async () => {

    let count = 0;

    const c1 = () => { ++count; ev.unlisten(c1); ev.unlisten(c2) };
    const c2 = () => { assert(false) };
    const c3 = () => { ++count; };

    const ev = new Event();
    ev.listen(c1)
      .listen(c2)
      .listen(c3)
      .trigger();

    assert( count === 2);
});
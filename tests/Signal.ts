import {it, describe} from "jsr:@std/testing/bdd";
import { assert } from "jsr:@std/assert";

import Signal from "../src/Signal";

const tests = describe("Signal", {
                            sanitizeResources: false,
                            sanitizeOps      : false
                    }); // beforeAll / afterAll

it(tests, "initial call", async () => {

    const signal = new Signal();

    let count = 0;

    signal.listen( () => {
        ++count;
    });

    assert(count === 1);
});

it(tests, "get value", async () => {

    let value = 0;

    const signal = new Signal<number>();
    signal.inputValue = 2;

    signal.listen( () => {
        value = signal.value!;
    });

    assert(value === 2);
});


it(tests, "get value", async () => {

    let value = 0;

    const s1 = new Signal<number>();
    const s2 = new Signal<number>();

    s1.inputValue  = 2;
    s2.inputSource = s1

    s2.listen( () => {
        value = s2.value!;
    });

    assert(value === 2);
});

it(tests, "not trigger if no values", async () => {

    let count = 0;

    const s1 = new Signal();
    const s2 = new Signal();

    s2.listen( () => ++count );
    s2.inputSource = s1;

    assert(count === 1); // only the initial call
});
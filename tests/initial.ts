import {it, describe} from "jsr:@std/testing/bdd";
import { assert } from "jsr:@std/assert";

const tests = describe("initial", {
                            sanitizeResources: false,
                            sanitizeOps      : false
                    }); // beforeAll / afterAll

it(tests, "initial", async () => {
    //TEST.
    assert(true);
});

it(tests, "initial2", async () => {
    //TEST.
    assert(false);
});

it(tests, "initial3", async () => {
    //TEST.
    assert(false);
});
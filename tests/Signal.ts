import {it, describe} from "jsr:@std/testing/bdd";
import { assert } from "jsr:@std/assert";

import Signal         from "../src/Signal";

const tests = describe("EventListener", {
                            sanitizeResources: false,
                            sanitizeOps      : false
                    }); // beforeAll / afterAll

it(tests, "simple signal", async () => {

    new Signal();
});
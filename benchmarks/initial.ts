// (b) => (b.start() / b.end() for critical section.)

Deno.bench("hello world #1", { group: "url", baseline: true }, async () => {
  new URL("https://deno.land");
});

Deno.bench("hello world #2", { group: "url" }, async () => {
  new URL("https://deno.land");
});
Deno.bench("hello world #3", { group: "url" }, async () => {
  new URL("https://deno.land");
});
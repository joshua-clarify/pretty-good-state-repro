import { defineState } from "pretty-good-state";
import { describe, expect, it } from "vitest";

const CounterState = defineState({
  count: 0,
  increment() {
    this.count++;
  },
});

describe("CounterState", () => {
  it("should increment", () => {
    const state1 = CounterState();
    state1.increment();
    expect(state1.count).toBe(1);
  });

  it("should be reset", () => {
    const state2 = CounterState();
    expect(state2.count).toBe(0); // fails
  });
});

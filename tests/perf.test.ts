import { describe, it, expect } from "vitest";
import { createMemoCache, yieldToMain } from "../src/lib/perf";

describe("perf utilities", () => {
  it("createMemoCache stores and retrieves values", () => {
    const cache = createMemoCache<number>();
    cache.set("key1", 42);
    expect(cache.get("key1")).toBe(42);
    expect(cache.get("nonexistent")).toBeUndefined();
  });

  it("createMemoCache evicts oldest when at capacity", () => {
    const cache = createMemoCache<number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3); // should evict "a"
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("createMemoCache clear removes all entries", () => {
    const cache = createMemoCache<string>();
    cache.set("x", "hello");
    cache.clear();
    expect(cache.get("x")).toBeUndefined();
  });

  it("yieldToMain resolves", async () => {
    await expect(yieldToMain()).resolves.toBeUndefined();
  });
});

import { describe, it, expect } from "vitest";
import {
  createCheckoutSession,
  PRODUCT_IDS,
  getStripeClient,
} from "../src/lib/billing/stripe";

describe("stripe scaffold", () => {
  it("has placeholder product IDs", () => {
    expect(PRODUCT_IDS.instructor).toBeTruthy();
    expect(PRODUCT_IDS.institution).toBeTruthy();
  });

  it("getStripeClient returns null in dev mode", () => {
    expect(getStripeClient()).toBeNull();
  });

  it("createCheckoutSession returns a mock URL for instructor", async () => {
    const result = await createCheckoutSession("instructor");
    expect(result.url).toContain("instructor");
  });

  it("createCheckoutSession returns a mock URL for institution", async () => {
    const result = await createCheckoutSession("institution");
    expect(result.url).toContain("institution");
  });
});

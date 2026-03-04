/**
 * Stripe integration scaffold.
 *
 * This module prepares payment capability but does NOT enable live billing.
 * In development mode all functions return mock responses so that the rest of
 * the codebase can be wired up without a real Stripe account.
 */

/** Plan types that can be purchased. */
export type PlanType = "instructor" | "institution";

/** Placeholder product IDs – replace with real Stripe price IDs later. */
export const PRODUCT_IDS: Record<PlanType, string> = {
  instructor: "price_instructor_placeholder",
  institution: "price_institution_placeholder",
};

/** Shape returned by the checkout-session creation endpoint. */
export interface CheckoutSessionResponse {
  url: string;
}

/**
 * Initialise the Stripe client.
 *
 * Returns `null` when no publishable key is configured (development default).
 */
export function getStripeClient(): null {
  // Placeholder – in production this would do:
  //   import Stripe from 'stripe';
  //   return new Stripe(process.env.STRIPE_SECRET_KEY!);
  return null;
}

/**
 * Create a Stripe checkout session for the requested plan.
 *
 * In development mode this returns a mock URL pointing to the pricing page.
 */
export async function createCheckoutSession(
  plan: PlanType,
): Promise<CheckoutSessionResponse> {
  const _priceId = PRODUCT_IDS[plan];

  // Development / mock mode
  return {
    url: `/pricing?mock_checkout=${plan}`,
  };
}

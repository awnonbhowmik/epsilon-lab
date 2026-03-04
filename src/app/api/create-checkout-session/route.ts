import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/billing/stripe";
import type { PlanType } from "@/lib/billing/stripe";

/**
 * POST /api/create-checkout-session
 *
 * Receives a plan type ("instructor" | "institution") and returns a Stripe
 * checkout URL.  In development mode a mock URL is returned.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { plan?: string };
    const plan = body.plan;

    if (plan !== "instructor" && plan !== "institution") {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "instructor" or "institution".' },
        { status: 400 },
      );
    }

    const session = await createCheckoutSession(plan as PlanType);
    return NextResponse.json(session);
  } catch {
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}

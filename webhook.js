// Creates a Stripe Checkout session for the Pro plan and returns its URL.
// The frontend redirects the browser to that URL — Stripe hosts the actual
// payment form, so no card details ever touch your own code.

import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_PRO;

  if (!secretKey || !priceId) {
    res.status(500).json({
      error:
        "Stripe isn't configured yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_PRO in your environment variables, then redeploy.",
    });
    return;
  }

  const stripe = new Stripe(secretKey);
  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message || "Couldn't start checkout." });
  }
}

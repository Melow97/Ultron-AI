// Stripe calls this endpoint directly (not the browser) when something
// happens on a subscription — payment succeeded, payment failed, someone
// cancelled, etc. This is the ONLY reliable way to know someone actually
// paid; never trust the success_url redirect alone for that, since a user
// can close the tab or the redirect can fail even after payment succeeds.
//
// Right now this just verifies the event is genuinely from Stripe and logs
// it. There's no database in this project yet, so there's nowhere to
// actually record "this user is now Pro" — see the TODO below for where
// that goes once you add one (Neon/Supabase Postgres both work well here).

import Stripe from "stripe";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false, // Stripe needs the raw, unparsed body to verify the signature
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!webhookSecret || !secretKey) {
    res.status(500).send("Stripe webhook isn't configured (missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY).");
    return;
  }

  const stripe = new Stripe(secretKey);
  const sig = req.headers["stripe-signature"];
  const rawBody = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    // Signature didn't match — this request did NOT genuinely come from Stripe.
    res.status(400).send(`Webhook signature verification failed: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // TODO: look up the user (session.customer_email or a client_reference_id
      // you set when creating the session) and mark them as Pro in your database.
      console.log("Checkout completed for:", session.customer_email);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      // TODO: find the user by subscription.customer and downgrade them to Free.
      console.log("Subscription cancelled:", subscription.id);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // TODO: optionally notify the user their payment failed.
      console.log("Payment failed for customer:", invoice.customer);
      break;
    }
    default:
      break;
  }

  res.status(200).json({ received: true });
}

/**
 * Cloudflare Worker — NOWPayments "Create invoice" proxy
 * -------------------------------------------------------
 * Why: GitHub Pages is static. Your NOWPayments API key must NEVER sit in
 * browser JS. This Worker holds the key and creates invoices server-side.
 *
 * API docs: https://documenter.getpostman.com/view/7907941/2s93JusNJt
 * Endpoint used: POST https://api.nowpayments.io/v1/invoice
 *
 * Deploy (Cloudflare account, free tier works):
 *   1. dash.cloudflare.com → Workers & Pages → Create Worker
 *   2. Paste this file
 *   3. Settings → Variables → add secret:
 *        NOWPAYMENTS_API_KEY = (from NOWPayments dashboard)
 *   4. Optional: ALLOWED_ORIGIN = https://www.220bioworx.com
 *   5. Deploy → copy worker URL into payment-config.js:
 *        createInvoiceUrl: "https://YOUR_WORKER.workers.dev/create-invoice"
 *
 * NOWPayments account setup (before go-live):
 *   - Add Coinbase wallet / payout wallet in Store Settings
 *   - Generate API key
 *   - Generate IPN secret (for webhooks; optional for invoice-only start)
 *   - Enable coins you want to accept
 */

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "https://www.220bioworx.com";
    const cors = {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/create-invoice") {
      return json({ error: "Not found" }, 404, cors);
    }

    if (!env.NOWPAYMENTS_API_KEY) {
      return json({ error: "Server misconfigured: missing API key" }, 500, cors);
    }

    // Optional origin lock
    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
      return json({ error: "Origin not allowed" }, 403, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    const price_amount = Number(body.price_amount);
    const order_id = String(body.order_id || "").slice(0, 128);
    const order_description = String(body.order_description || "220 BioWorX research order").slice(0, 400);
    const price_currency = String(body.price_currency || "usd").toLowerCase();

    if (!price_amount || price_amount <= 0 || !order_id) {
      return json({ error: "price_amount and order_id required" }, 400, cors);
    }

    // Cap amount to reduce abuse (adjust as needed)
    if (price_amount > 50000) {
      return json({ error: "Amount too large" }, 400, cors);
    }

    const payload = {
      price_amount,
      price_currency,
      order_id,
      order_description,
      success_url: body.success_url || "https://www.220bioworx.com/cart.html?crypto=paid",
      cancel_url: body.cancel_url || "https://www.220bioworx.com/cart.html?crypto=cancel",
      is_fixed_rate: false,
      is_fee_paid_by_user: false,
    };

    const npRes = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.NOWPAYMENTS_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await npRes.json().catch(() => ({}));
    if (!npRes.ok) {
      return json(
        { error: "NOWPayments error", status: npRes.status, detail: data },
        502,
        cors
      );
    }

    // Typical fields: id, invoice_url, order_id, ...
    return json(
      {
        invoice_id: data.id,
        invoice_url: data.invoice_url,
        order_id: data.order_id,
        raw: data,
      },
      200,
      cors
    );
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

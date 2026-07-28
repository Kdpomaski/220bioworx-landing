/**
 * Cloudflare Worker — branded invoice email from Customerservice@220bioworx.com
 * ---------------------------------------------------------------------------
 * Uses Resend (https://resend.com) free tier.
 *
 * Setup:
 * 1. Create Resend account → API key
 * 2. Add & verify domain 220bioworx.com in Resend (DNS records they give you)
 * 3. Create this Worker, paste this file
 * 4. Secrets:
 *      RESEND_API_KEY = re_xxxx
 *    Optional vars:
 *      FROM_EMAIL = Customerservice@220bioworx.com
 *      FROM_NAME  = 220 BioWorX Customer Service
 *      OWNER_BCC  = Owner@220bioworx.com  (hidden from buyer; OWNER_CC still accepted)
 *      ALLOWED_ORIGIN = https://www.220bioworx.com
 * 5. Deploy → set payment-config.js:
 *      invoiceEmailUrl: "https://YOUR_WORKER.workers.dev/send-invoice"
 *
 * POST /send-invoice  JSON body from cart checkout
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
    if (request.method !== "POST" || url.pathname !== "/send-invoice") {
      return json({ error: "Not found" }, 404, cors);
    }

    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
      return json({ error: "Origin not allowed" }, 403, cors);
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: "Missing RESEND_API_KEY secret" }, 500, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    const buyerEmail = String(body.buyerEmail || "").trim();
    const buyerName = String(body.buyerName || "Customer").trim();
    if (!buyerEmail || !buyerEmail.includes("@")) {
      return json({ error: "buyerEmail required" }, 400, cors);
    }

    const fromEmail = env.FROM_EMAIL || "Customerservice@220bioworx.com";
    const fromName = env.FROM_NAME || "220 BioWorX Customer Service";
    // Owner gets internal copy only (never on buyer-facing message headers)
    const ownerBcc = env.OWNER_BCC || env.OWNER_CC || "Owner@220bioworx.com";
    const csInbox = env.CS_INBOX || fromEmail;

    const ref = String(body.reference || "BW-UNKNOWN");
    const method = String(body.paymentMethod || "Payment");
    const total = String(body.orderTotal || "");
    const payText = String(body.paymentInstructions || "");
    const cartText = String(body.cartDetails || "");
    const org = String(body.organization || "");
    const institution = String(body.institutionType || "");
    const notes = String(body.notes || "");
    const cryptoUrl = String(body.cryptoInvoiceUrl || "");

    const subject = `Action required: Pay invoice ${ref} — 220 BioWorX`;
    const html = buildHtmlEmail({
      buyerName,
      ref,
      method,
      total,
      payText,
      cartText,
      org,
      institution,
      notes,
      cryptoUrl,
    });
    const text = buildTextEmail({
      buyerName,
      ref,
      method,
      total,
      payText,
      cartText,
      org,
      institution,
      notes,
      cryptoUrl,
    });

    // 1) Buyer invoice FROM Customerservice@ — Owner is BCC (hidden from buyer)
    const buyerPayload = {
      from: `${fromName} <${fromEmail}>`,
      to: [buyerEmail],
      reply_to: fromEmail,
      subject,
      html,
      text,
    };
    if (ownerBcc && ownerBcc.toLowerCase() !== buyerEmail.toLowerCase()) {
      buyerPayload.bcc = [ownerBcc];
    }
    const buyerSend = await resendSend(env.RESEND_API_KEY, buyerPayload);

    if (!buyerSend.ok) {
      return json(
        { error: "Failed to send buyer email", detail: buyerSend.data },
        502,
        cors
      );
    }

    // 2) Internal copy to CS only (Owner already BCC'd on buyer mail; avoid duplicate if same)
    const internalSubject = `[ORDER] ${ref} — ${method} — ${total} — ${buyerName}`;
    const internalHtml = `
      <p><strong>New order request</strong></p>
      <p>Buyer was sent invoice email from ${fromEmail} (Owner BCC'd, not visible to buyer).</p>
      <hr/>
      ${html}
    `;
    const toInternal = [csInbox].filter(
      (e, i, a) =>
        e &&
        a.indexOf(e) === i &&
        e.toLowerCase() !== buyerEmail.toLowerCase() &&
        e.toLowerCase() !== String(ownerBcc || "").toLowerCase()
    );

    let internalSend = { ok: true, data: null };
    if (toInternal.length) {
      internalSend = await resendSend(env.RESEND_API_KEY, {
        from: `${fromName} <${fromEmail}>`,
        to: toInternal,
        reply_to: buyerEmail,
        subject: internalSubject,
        html: internalHtml,
        text: `New order ${ref}\nBuyer: ${buyerName} <${buyerEmail}>\n\n${text}`,
      });
    }

    return json(
      {
        ok: true,
        buyerId: buyerSend.data?.id || null,
        internalOk: internalSend.ok,
        from: fromEmail,
      },
      200,
      cors
    );
  },
};

async function resendSend(apiKey, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function preBlock(text) {
  return `<pre style="margin:0;white-space:pre-wrap;font-family:ui-monospace,Consolas,monospace;font-size:13px;line-height:1.5;color:#1a1a1a;">${escapeHtml(text)}</pre>`;
}

function buildHtmlEmail(d) {
  const cryptoBlock = d.cryptoUrl
    ? `<p style="margin:12px 0 0;"><a href="${escapeHtml(d.cryptoUrl)}" style="color:#FF5A00;font-weight:700;">Open crypto payment link</a></p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0b0b0b;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0b0b;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#111;border:1px solid #333;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#080B0D;padding:20px 24px;border-bottom:3px solid #FF5A00;">
            <div style="font-size:22px;font-weight:800;letter-spacing:0.04em;color:#ffffff;">220 <span style="color:#FF5A00;">BIOWORX</span></div>
            <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#4C5A3A;margin-top:6px;">Biomolecular Research · Research Use Only</div>
          </td>
        </tr>
        <tr>
          <td style="padding:0;">
            <div style="background:#FF5A00;color:#ffffff;padding:16px 20px;font-size:16px;font-weight:800;letter-spacing:0.03em;text-align:center;line-height:1.4;">
              ⚠ ACTION NEEDED — PAY TO PROCEED<br>
              <span style="font-size:13px;font-weight:600;display:block;margin-top:6px;">
                Pay using: ${escapeHtml(d.method)} · No shipping until payment is confirmed
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;color:#e8e8e8;font-size:15px;line-height:1.55;">
            <p style="margin:0 0 12px;">Hi ${escapeHtml(d.buyerName)},</p>
            <p style="margin:0 0 16px;">
              Thank you for your research order with <strong style="color:#fff;">220 BioWorX</strong>.
              Your invoice is ready. Please complete payment using the method you selected, then reply to this email.
            </p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;background:#1a1a1a;border:1px solid #333;border-radius:8px;">
              <tr><td style="padding:14px 16px;">
                <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#999;margin-bottom:6px;">Invoice reference</div>
                <div style="font-size:20px;font-weight:800;color:#FF5A00;letter-spacing:0.04em;">${escapeHtml(d.ref)}</div>
                <div style="margin-top:10px;font-size:14px;color:#ccc;">
                  <strong style="color:#fff;">Amount due:</strong> ${escapeHtml(d.total || "See details below")}<br>
                  <strong style="color:#fff;">Payment method:</strong> ${escapeHtml(d.method)}
                </div>
              </td></tr>
            </table>

            <div style="background:#2a1508;border:2px solid #FF5A00;border-radius:8px;padding:16px;margin:0 0 18px;">
              <div style="font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#FF5A00;margin-bottom:10px;">Your action items</div>
              <ol style="margin:0;padding-left:20px;color:#f0e6dc;font-size:14px;line-height:1.55;">
                <li style="margin-bottom:8px;"><strong>Pay</strong> using <strong>${escapeHtml(d.method)}</strong> with the instructions below. Include reference <strong>${escapeHtml(d.ref)}</strong>.</li>
                <li style="margin-bottom:8px;"><strong>Reply to this email</strong> with:
                  <ul style="margin:6px 0 0 0;padding-left:18px;">
                    <li>This invoice reference (<strong>${escapeHtml(d.ref)}</strong>)</li>
                    <li><strong>Proof of payment</strong> (screenshot, confirmation #, or bank receipt)</li>
                  </ul>
                </li>
                <li><strong>Wait for confirmation</strong> — we do <u>not</u> ship until payment is confirmed. Target ship window: within 72 hours after confirmation.</li>
              </ol>
              ${cryptoBlock}
            </div>

            <h2 style="margin:0 0 10px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#FF5A00;">Payment instructions</h2>
            <div style="background:#f7f7f7;border-radius:8px;padding:14px;margin:0 0 18px;">
              ${preBlock(d.payText)}
            </div>

            <h2 style="margin:0 0 10px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#FF5A00;">Order / cart details</h2>
            <div style="background:#f7f7f7;border-radius:8px;padding:14px;margin:0 0 18px;">
              ${preBlock(d.cartText)}
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;font-size:13px;color:#bbb;">
              <tr><td>
                <strong style="color:#fff;">Organization:</strong> ${escapeHtml(d.org || "—")}<br>
                <strong style="color:#fff;">Institution type:</strong> ${escapeHtml(d.institution || "—")}<br>
                <strong style="color:#fff;">Notes:</strong> ${escapeHtml(d.notes || "—")}
              </td></tr>
            </table>

            <p style="margin:0 0 8px;font-size:13px;color:#999;">
              Shipping: $18 flat 2–3 Day, or FREE when merchandise total is over $250 (after volume discounts).
              No returns or exchanges after shipping —
              <a href="https://www.220bioworx.com/returns.html" style="color:#FF5A00;">Return/Refund Policy</a>.
            </p>
            <p style="margin:0;font-size:12px;color:#777;line-height:1.45;">
              Research Use Only. Not for human or veterinary use. Not FDA approved.
              Not a 503A or 503B compounding pharmacy.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#080B0D;padding:16px 24px;border-top:1px solid #333;font-size:12px;color:#70777D;text-align:center;">
            220 BioWorX · Customerservice@220bioworx.com · www.220bioworx.com
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildTextEmail(d) {
  return [
    "220 BIOWORX — ACTION NEEDED: PAY TO PROCEED",
    "========================================",
    `No shipping until payment is confirmed.`,
    `Pay using: ${d.method}`,
    "",
    `Hi ${d.buyerName},`,
    "",
    "Thank you for your research order. Your invoice is ready.",
    "",
    `INVOICE REFERENCE: ${d.ref}`,
    `AMOUNT DUE: ${d.total}`,
    `PAYMENT METHOD: ${d.method}`,
    "",
    "YOUR ACTION ITEMS",
    "1) Pay using the method and instructions below. Include reference " + d.ref + ".",
    "2) REPLY TO THIS EMAIL with:",
    "   - This invoice reference (" + d.ref + ")",
    "   - Proof of payment (screenshot, confirmation #, or bank receipt)",
    "3) Wait for our confirmation — we do not ship until payment is confirmed.",
    "   Target: ship within 72 hours after payment confirmation.",
    d.cryptoUrl ? "Crypto pay link: " + d.cryptoUrl : "",
    "",
    "PAYMENT INSTRUCTIONS",
    "--------------------",
    d.payText,
    "",
    "ORDER / CART DETAILS",
    "--------------------",
    d.cartText,
    "",
    `Organization: ${d.org || "—"}`,
    `Institution type: ${d.institution || "—"}`,
    `Notes: ${d.notes || "—"}`,
    "",
    "Return/Refund Policy: https://www.220bioworx.com/returns.html",
    "Research Use Only. Not for human use. Not FDA approved.",
    "",
    "— 220 BioWorX Customer Service",
    "Customerservice@220bioworx.com",
  ]
    .filter((l) => l !== "")
    .join("\n");
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

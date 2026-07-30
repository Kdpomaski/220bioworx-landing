/**
 * 220 BioWorX — payment instructions (not shown on public marketing pages).
 * Included in checkout email + on-screen confirmation ONLY after the buyer
 * selects a method in the shopping cart.
 *
 * Crypto: use NOWPayments (hosted invoice). Do NOT put API keys here.
 * Coinbase wallet is configured as a payout wallet inside NOWPayments — not on this site.
 */
window.BW_PAYMENT = {
  zelle: {
    label: "Zelle",
    recipientName: "220 BioWorX",
    sendTo: "Customerservice@220bioworx.com",
    memo: "Include invoice / cart reference number in the Zelle memo",
  },
  ach: {
    label: "ACH / bank transfer",
    accountName: "220 Tech",
    bankName: "Wells Fargo",
    routing: "063107513",
    account: "2215689676",
    accountType: "Business checking",
  },
  crypto: {
    label: "Cryptocurrency (NOWPayments)",
    /**
     * Fixed NOWPayments hosted payment link (button embed).
     * Shown after checkout when buyer selects Cryptocurrency.
     * Note: this invoice id is created in NOWPayments — amount may be fixed on their side.
     * For per-cart amounts, use createInvoiceUrl worker later.
     */
    staticInvoiceUrl: "https://nowpayments.io/payment/?iid=4790895775&source=button",
    /** Official NOWPayments button image for checkout confirmation */
    buttonImageUrl: "https://nowpayments.io/images/embeds/payments-button-black.svg",
    /**
     * Optional Cloudflare Worker (or other backend) that holds the NOWPayments API key
     * and returns { invoice_url }. See nowpayments-worker.js
     * Example: "https://bw-nowpayments.YOUR_SUBDOMAIN.workers.dev/create-invoice"
     */
    createInvoiceUrl: "",
    priceCurrency: "usd",
    successPath: "https://www.220bioworx.com/cart.html?crypto=paid",
    cancelPath: "https://www.220bioworx.com/cart.html?crypto=cancel",
  },
  /** AJAX only — never use the non-/ajax/ URL as a form action (that navigates away). */
  formSubmitEndpoint: "https://formsubmit.co/ajax/6732b0b86bff8989d370457024b960ee",
  /** Internal copy only — FormSubmit _bcc so buyer never sees this address */
  ownerBcc: "Owner@220bioworx.com",
  /** @deprecated use ownerBcc */
  ownerCc: "Owner@220bioworx.com",
  /**
   * Branded invoice email FROM Customerservice@220bioworx.com
   * Deploy invoice-email-worker.js on Cloudflare + Resend, then set URL:
   * "https://YOUR_WORKER.workers.dev/send-invoice"
   */
  invoiceEmailUrl: "",
  fromEmail: "Customerservice@220bioworx.com",
  /** Highest matching tier wins (sorted high→low by minQty) */
  discounts: [
    { minQty: 10, pct: 30 },
    { minQty: 5, pct: 20 },
    { minQty: 3, pct: 10 },
  ],
  /**
   * Flat 2–3 day shipping. Free when merchandise (after volume discount) is over freeShippingMin.
   */
  shipping: {
    method: "2–3 Day shipping",
    flatRate: 18,
    freeShippingMin: 250,
    shipWithinHours: 72,
    note: "We aim to ship all orders within 72 hours of confirmed payment.",
  },
};

window.BW_methodLabel = function (method) {
  if (method === "zelle") return "Zelle";
  if (method === "ach") return "ACH / bank transfer";
  if (method === "crypto") return "Cryptocurrency (NOWPayments)";
  return method || "Unknown";
};

/**
 * @param {"zelle"|"ach"|"crypto"} method
 * @param {string} reference
 * @param {{ amount?: number, invoiceUrl?: string }} extra
 */
window.BW_formatPaymentInstructions = function (method, reference, extra) {
  const ref = reference || "(see cart / invoice reference below)";
  const P = window.BW_PAYMENT;
  extra = extra || {};

  if (method === "zelle") {
    const z = P.zelle;
    return [
      "══════════════════════════════════════",
      "PAYMENT INSTRUCTIONS — ZELLE",
      "══════════════════════════════════════",
      "Please pay by Zelle using the details below.",
      "Recipient name: " + z.recipientName,
      "Send to: " + z.sendTo,
      "Memo / note: " + z.memo,
      "Reference to include: " + ref,
      "══════════════════════════════════════",
    ].join("\n");
  }

  if (method === "ach") {
    const a = P.ach;
    return [
      "══════════════════════════════════════",
      "PAYMENT INSTRUCTIONS — ACH / BANK TRANSFER",
      "══════════════════════════════════════",
      "Please pay by ACH using the details below.",
      "Account name: " + a.accountName,
      "Bank: " + a.bankName,
      "Routing number: " + a.routing,
      "Account number: " + a.account,
      "Account type: " + a.accountType,
      "Payment description / reference: " + ref,
      "══════════════════════════════════════",
    ].join("\n");
  }

  if (method === "crypto") {
    const c = P.crypto || {};
    const lines = [
      "══════════════════════════════════════",
      "PAYMENT INSTRUCTIONS — CRYPTOCURRENCY",
      "══════════════════════════════════════",
      "Pay with crypto via NOWPayments (hosted invoice).",
      "Do not send crypto to random addresses from chat or email.",
      "Order / cart reference: " + ref,
    ];
    if (extra.amount != null) {
      lines.push("Amount (USD): $" + Number(extra.amount).toFixed(2));
    }
    if (extra.invoiceUrl) {
      lines.push("Pay here (NOWPayments): " + extra.invoiceUrl);
    } else if (c.staticInvoiceUrl) {
      lines.push("Pay here (NOWPayments): " + c.staticInvoiceUrl);
    } else {
      lines.push(
        "A NOWPayments invoice link will be created for this order amount."
      );
      lines.push(
        "If a link is not shown below, customer service will email your crypto payment link shortly."
      );
    }
    lines.push("After payment, keep the NOWPayments receipt and reference " + ref + ".");
    lines.push("══════════════════════════════════════");
    return lines.join("\n");
  }

  return "Payment method not selected.";
};

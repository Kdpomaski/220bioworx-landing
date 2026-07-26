/**
 * 220 BioWorX — payment instructions (not shown on public marketing pages).
 * Included in checkout email + on-screen confirmation ONLY after the buyer
 * selects Zelle or ACH in the shopping cart.
 *
 * Do not paste these details onto products.html or the home page.
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
  formSubmitEndpoint: "https://formsubmit.co/6732b0b86bff8989d370457024b960ee",
  ownerCc: "Owner@220bioworx.com",
  /** Volume discounts on total vial units in cart */
  discounts: [
    { minQty: 10, pct: 20 },
    { minQty: 5, pct: 15 },
    { minQty: 3, pct: 10 },
  ],
};

/**
 * Build plain-text payment block for email / confirmation.
 * @param {"zelle"|"ach"} method
 * @param {string} reference  invoice / cart reference id
 */
window.BW_formatPaymentInstructions = function (method, reference) {
  const ref = reference || "(see cart / invoice reference below)";
  const P = window.BW_PAYMENT;
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
  return "Payment method not selected.";
};

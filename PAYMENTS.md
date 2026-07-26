# 220 BioWorX — Payments setup

Public policy: **Zelle** and **ACH only**. Edit live details in `products.html` → `PAYMENT` object near the top of the `<script>` block.

## How to publish Zelle / ACH on the site

1. Open `products.html`
2. Find `const PAYMENT = { ... }`
3. Fill fields (examples below)
4. Commit and push:

```powershell
cd "$env:USERPROFILE\Desktop\220bioworx-landing"
git add products.html
git commit -m "Publish payment details"
git push
```

Empty strings (`""`) show: **Issued with invoice / order confirmation**.

### Example filled config

```js
const PAYMENT = {
  zelle: {
    recipientName: "220 BioWorX",
    sendTo: "payments@220bioworx.com", // or business mobile enrolled in Zelle
    memo: "Include invoice / reference number in the Zelle memo",
  },
  ach: {
    accountName: "220 Tech LLC", // exact name on business checking
    bankName: "Your Bank Name",
    routing: "XXXXXXXXX",
    account: "XXXXXXXXXXXX",
    accountType: "Business checking",
  },
  pendingLabel: "Issued with invoice / order confirmation",
};
```

## Recommended: business Zelle (not personal)

| Approach | Recommendation |
|----------|----------------|
| Personal checking Zelle | Avoid for business — taxes, liability, customer confusion |
| **220 Tech business checking + Zelle** | Preferred |
| Publish full routing/account on website | Optional; many keep ACH **on invoice only** for fraud safety |

### Typical bank steps

1. Log into **business** online banking for 220 Tech (business checking).
2. Find **Zelle** → Enroll / Manage recipients / Receive.
3. Enroll a **business email** (e.g. payments@ or Customerservice@) if the bank allows business profiles.
4. Confirm the **display name** customers see matches invoices (220 BioWorX / 220 Tech as bank allows).
5. Test a small transfer to yourself.

If your bank does **not** support business Zelle:

- Use **ACH** from business checking as primary.
- Or temporary personal Zelle only until business enrollment works — keep it off the public site if possible; put send-to on invoices only.

## Security tip

Publishing full **routing + account** on a public page increases fraud risk. Safer pattern:

- Site: “Zelle & ACH accepted · details on invoice”
- Invoice email: full Zelle handle + ACH instructions + reference #

You can leave ACH fields empty on the site and only fill `zelle.sendTo` when ready.

## Order / payment process (customer-facing)

1. Research inquiry  
2. Quote / invoice with reference #  
3. Customer pays Zelle or ACH with reference in memo  
4. Customer emails payment confirmation  
5. Order released  

## Not accepted

Cards, PayPal, Venmo, Cash App, crypto (unless you later change policy and update the page).

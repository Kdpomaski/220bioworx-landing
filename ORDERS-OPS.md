# Canceling orders & voiding invoices (220 BioWorX)

Your storefront does **not** run a full order-management database. Orders are:

1. **Cart reference** (e.g. `BW-250727-AB12`) stored in the buyer’s browser + emailed to you  
2. **FormSubmit email** to Customerservice@ (CC buyer; BCC Owner@ — not shown to buyer)  
3. Optional **NOWPayments crypto invoice** (if they chose crypto and Worker is live)  
4. Your own **manual invoice** / quote if you send one separately  

Use the steps below for unpaid clients, test orders, or mistakes.

---

## 1. “Cancel” a cart / invoice request (email-only)

There is nothing to void in GitHub Pages. Treat the **cart reference** as canceled in your process:

1. Find the order email by **reference** (`BW-…`).  
2. Reply-all (or internal note): **CANCELED — do not fulfill / do not accept payment**.  
3. Optional: email the client that the request is canceled and they should not pay.  
4. If they already paid, process a **refund** (see Zelle / ACH / crypto below).

**Testing tip:** Use a clear test name/email and subject so you can ignore those threads.

---

## 2. Zelle / ACH (no automated invoice ID)

You typically do **not** create a formal bank “invoice object”—you send payment instructions with a **reference**.

| Situation | Action |
|-----------|--------|
| Client never paid | Mark reference canceled; do not ship |
| Client paid after cancel | Refund via Zelle/ACH; confirm with client |
| Wrong amount paid | Contact client; refund or apply to new reference |

Keep a simple spreadsheet: `Reference | Status (open/paid/canceled/refunded) | Notes`.

---

## 3. NOWPayments crypto invoices

If a crypto **invoice_url** was created:

### In NOWPayments dashboard
1. Log in → **Payments** / **Invoices** (wording varies).  
2. Find invoice by **order_id** (your cart reference, e.g. `BW-…`).  
3. If **unpaid / expired**: leave it; it will expire, or use any **Cancel** control if shown.  
4. If **partially paid / paid by mistake**: use NOWPayments **refund** / support process for that payment.  
5. Do **not** reuse the same order_id for a new live order after cancel—generate a new cart reference (client can refresh cart page).

### If you never deployed the Worker
You only sent a manual invoice from the NOWPayments UI—cancel/void there the same way.

---

## 4. FormSubmit

FormSubmit only **delivers email**. You cannot “void” a FormSubmit submission.  
Delete or archive the email; update your tracking sheet to **canceled**.

---

## 5. Recommended ops checklist (unpaid / testing)

1. Spreadsheet or Notion: Reference · Date · Buyer · Method · Amount · Status  
2. Status values: `Pending` · `Paid` · `Canceled` · `Refunded` · `Test`  
3. After **48–72 hours unpaid** → set `Canceled`, optional client email  
4. **Test orders**: prefix org name with `TEST-` so they never ship  

---

## 6. Client-facing cancel language (optional)

> We have canceled invoice / cart reference **BW-XXXX**. Please do not send payment.  
> If you already paid, reply with proof of payment and we will process a refund.

---

## 7. Future (if you want one-click cancel later)

Would require a small backend + order store (e.g. Airtable, Supabase, or Shopify).  
Current static GitHub setup = **email + NOWPayments + your tracking sheet**.

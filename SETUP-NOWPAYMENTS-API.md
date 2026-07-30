# Link NOWPayments API to the cart (correct amount + order ID)

## Why we can’t put the API key in the website

Your store is **static** (GitHub Pages). Everything in `payment-config.js` is **public** — anyone can open the page source and steal the key.

If the browser called NOWPayments with your key:

| Risk | What happens |
|------|----------------|
| Stolen API key | Attackers create fake invoices, abuse your account |
| Fake amounts | Malicious scripts could alter payment requests |
| No secrets | Static sites have nowhere safe to hide keys |

So:

```text
Browser (cart)  →  YOUR Worker (holds API key)  →  NOWPayments API
                      ↑ secret stays here only
```

The cart already supports this. File ready: **`nowpayments-worker.js`**.  
You only need: **NOWPayments API key** + **free Cloudflare Worker** + one line in **`payment-config.js`**.

---

## What the buyer gets after setup

1. Cart total e.g. **$158.00**, reference **`BW-260730-XXXX`**
2. Selects **Cryptocurrency** → Request invoice  
3. Site calls your Worker with that amount + reference  
4. Worker calls NOWPayments **Create Invoice**  
5. Buyer gets a **unique pay link** for **that order only**  
6. NOWPayments button / link uses that dynamic URL  
7. Order email includes the same link  

**Not** the fixed embed `iid=4790895775` (that was one static amount).

---

## Setup checklist (about 20–30 minutes)

### A. NOWPayments

1. Log in: https://account.nowpayments.io  
2. Connect **payout wallet** (e.g. Coinbase) in Store Settings  
3. Enable the coins you accept  
4. **API keys** → create / copy **API key**  
   - Keep it private (password manager)  
   - Never paste into the website HTML/JS  

Optional: IPN secret later (auto “paid” notifications) — not required for create-invoice.

### B. Cloudflare Worker (free)

1. Account: https://dash.cloudflare.com (free tier is enough)  
2. **Workers & Pages** → **Create** → Worker  
3. Name e.g. `bw-nowpayments`  
4. Replace default code with the full contents of **`nowpayments-worker.js`** from this repo  
5. **Deploy**  
6. **Settings → Variables and Secrets** → add secret:

| Name | Value |
|------|--------|
| `NOWPAYMENTS_API_KEY` | (your key from NOWPayments) |
| `ALLOWED_ORIGIN` | `https://www.220bioworx.com` (plain text variable OK) |

7. Deploy again if needed  
8. Copy worker URL, e.g.  
   `https://bw-nowpayments.YOUR_SUBDOMAIN.workers.dev`  

Your create endpoint is:

```text
https://bw-nowpayments.YOUR_SUBDOMAIN.workers.dev/create-invoice
```

### C. Wire the website

In **`payment-config.js`**:

```js
crypto: {
  staticInvoiceUrl: "",  // must stay empty
  createInvoiceUrl: "https://bw-nowpayments.YOUR_SUBDOMAIN.workers.dev/create-invoice",
  // ...
}
```

Commit and push (or tell us the worker URL and we can set it).

### D. Test

1. Hard-refresh cart: Ctrl+F5  
2. Add a product → checkout → **Cryptocurrency**  
3. Submit → you should see:
   - Pay button / link to a **new** NOWPayments invoice  
   - Amount matching cart total  
   - Order id / description with your **BW-…** reference  
4. In NOWPayments dashboard: new invoice appears with that order id  

---

## What we already built in the cart

| Feature | Status |
|---------|--------|
| Call `createInvoiceUrl` with `price_amount` = cart total | ✅ |
| Send `order_id` = cart reference (`BW-…`) | ✅ |
| Show NOWPayments button when `invoice_url` returns | ✅ |
| Open pay link in new tab | ✅ |
| Email includes crypto link when available | ✅ |
| API key in browser | ❌ never |

---

## If you don’t deploy the Worker yet

Crypto checkout still works as **manual**:

- Buyer requests invoice → you get email with total + `BW-…`  
- You create an invoice in NOWPayments for **that** amount  
- You email them the link  

No fixed button. No wrong amount on the site.

---

## After you have the Worker URL

Reply with:

```text
https://_____.workers.dev/create-invoice
```

We can paste it into `payment-config.js` and push live in one step.

---

## Security rules (keep forever)

- API key **only** in Cloudflare secret  
- `createInvoiceUrl` in the site is OK (public URL of *your* worker, not the key)  
- Never commit the API key into git  
- Rotate the key if it ever leaks  

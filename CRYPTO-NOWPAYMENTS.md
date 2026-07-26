# Crypto payments with NOWPayments + GitHub Pages

Your site is **static** (GitHub Pages). That shapes how crypto must work.

## Important concepts

| Piece | Role |
|--------|------|
| **This website** | Cart, method selection, order email |
| **NOWPayments** | Creates a **hosted invoice** (QR + address + coin picker). Customer pays there. |
| **Coinbase wallet** | Your **payout wallet** inside NOWPayments settings — **not** pasted on the website as a deposit address |
| **API key** | Secret — **never** put in `index.html` / browser JS |

[NOWPayments API docs (Postman)](https://documenter.getpostman.com/view/7907941/2s93JusNJt)

---

## Three ways to go live (pick one)

### A — Manual invoice (fastest, no code server)

Best while volume is low.

1. NOWPayments account → connect **Coinbase** (or other) payout wallet in Store Settings  
2. Generate **API key** (for later automation; optional for pure manual)  
3. For each order: Dashboard → **Invoices** → Create invoice  
   - Amount = cart total (USD)  
   - Order ID = cart reference (`BW-…`)  
4. Email the **invoice link** to the customer  

**Site already:** customer selects **Cryptocurrency** in cart → you get email with amount + reference → you send them the NOWPayments link.

---

### B — Hosted invoice via Cloudflare Worker (recommended for auto)

Uses API: **POST Create Invoice**  
`https://api.nowpayments.io/v1/invoice`

1. Deploy `nowpayments-worker.js` on [Cloudflare Workers](https://workers.cloudflare.com) (free tier OK)  
2. Add secret: `NOWPAYMENTS_API_KEY`  
3. Optional: `ALLOWED_ORIGIN=https://www.220bioworx.com`  
4. In `payment-config.js` set:

```js
crypto: {
  createInvoiceUrl: "https://YOUR_WORKER.workers.dev/create-invoice",
  // ...
}
```

5. Cart flow when customer picks **Crypto**:  
   - Browser calls **your Worker only** (never NOWPayments with the key)  
   - Worker creates invoice for cart USD total + `order_id` = cart reference  
   - Customer is redirected to `invoice_url`  
   - Confirmation email includes that link at the top  

---

### C — Full API payments + IPN webhooks (advanced)

From the Postman docs:

- `POST /v1/payment` — create payment  
- `GET /v1/payment/{id}` — status  
- `ipn_callback_url` + **IPN secret** — server must verify signatures  

Requires a real backend (Worker/server) that:

- Stores order state  
- Verifies IPN  
- Marks order paid  

**Not possible on GitHub Pages alone.** Use B first; add IPN when you need automatic “paid” fulfillment.

---

## Coinbase wallet setup (with NOWPayments)

1. Log into [NOWPayments account](https://account.nowpayments.io)  
2. **Store settings → Wallets / payout**  
3. Add the wallet address(es) from **Coinbase** for coins you accept  
   - Prefer receiving to addresses Coinbase shows for that asset  
   - Double-check network (e.g. USDT-ERC20 vs TRC20)  
4. Save and enable currencies in NOWPayments  

You do **not** put the Coinbase address on 220bioworx.com. NOWPayments generates **temporary deposit addresses** per invoice.

---

## Security rules

| Do | Don’t |
|----|--------|
| Keep API key in Worker secrets | Put `x-api-key` in frontend JS |
| Use hosted **invoice_url** for customers | Publish a permanent personal wallet for all orders |
| Match `order_id` to cart reference `BW-…` | Rely on memo-only crypto with no invoice |
| Start with sandbox/test if NOWPayments offers it | Skip verifying a test payment end-to-end |

---

## Site files

| File | Purpose |
|------|---------|
| `payment-config.js` | Zelle/ACH + crypto settings (no API key) |
| `cart.html` | Payment method radios including Crypto |
| `nowpayments-worker.js` | Optional secure Create Invoice proxy |
| `CRYPTO-NOWPAYMENTS.md` | This guide |

---

## Customer experience (current design)

1. Cart → select **Cryptocurrency (NOWPayments)**  
2. Request invoice  
3. If Worker configured → redirect to NOWPayments pay page  
4. Else → on-screen + email instructions; CS creates/sends invoice link  
5. Email always includes **payment block on top** + **cart/invoice details**

---

## Checklist before advertising crypto

- [ ] Coinbase/payout wallet linked in NOWPayments  
- [ ] API key created (for Worker path)  
- [ ] Test invoice $1 paid with a small amount  
- [ ] Cart crypto option live on www.220bioworx.com  
- [ ] Worker URL set (optional automation)  
- [ ] CS knows how to create manual invoices as backup  

# Send invoices FROM Customerservice@220bioworx.com

FormSubmit **cannot** send as your domain. To get a real
`From: Customerservice@220bioworx.com` with branding, use:

**Cloudflare Worker + Resend** (free tier is enough to start).

## 1. Resend account (5–10 minutes)

1. Sign up: https://resend.com  
2. **API Keys** → create key → copy `re_…`  
3. **Domains** → **Add** `220bioworx.com`  
4. Add the DNS records Resend shows (at your DNS host — Wix/GitHub domain DNS)  
5. Wait until domain status is **Verified**  
6. You can then send from `Customerservice@220bioworx.com`

## 2. Cloudflare Worker

1. https://dash.cloudflare.com → **Workers & Pages** → **Create Worker**  
2. Name e.g. `bw-invoice-email`  
3. Paste contents of `invoice-email-worker.js`  
4. **Deploy**  
5. **Settings → Variables**:
   - Secret: `RESEND_API_KEY` = your Resend key  
   - Optional text:
     - `FROM_EMAIL` = `Customerservice@220bioworx.com`
     - `FROM_NAME` = `220 BioWorX Customer Service`
     - `OWNER_BCC` = `Owner@220bioworx.com` (BCC only — not shown to buyer; `OWNER_CC` still works)
     - `CS_INBOX` = `Customerservice@220bioworx.com`
     - `ALLOWED_ORIGIN` = `https://www.220bioworx.com`
6. Copy worker URL, e.g.  
   `https://bw-invoice-email.YOUR_SUBDOMAIN.workers.dev`

## 3. Point the website at the Worker

In `payment-config.js`:

```js
invoiceEmailUrl: "https://bw-invoice-email.YOUR_SUBDOMAIN.workers.dev/send-invoice",
```

Then:

```powershell
cd "$env:USERPROFILE\Desktop\220bioworx-landing"
git add payment-config.js
git commit -m "Enable branded invoice email worker"
git push
```

## 4. What the buyer gets

- **From:** 220 BioWorX Customer Service \<Customerservice@220bioworx.com\>  
- Orange banner: **ACTION NEEDED — PAY TO PROCEED**  
- Method selected, amount, invoice reference  
- Action items: pay → reply with invoice ref + proof of payment → no ship until confirmed  
- Payment instructions + cart details  
- Internal copy to CS + Owner  

## 5. Test

1. Place a test order with your personal email as buyer  
2. Confirm From address is Customerservice@  
3. Confirm CS/Owner receive internal copy  

## Fallback

If `invoiceEmailUrl` is empty, cart still POSTs to FormSubmit (From will **not** be your domain).

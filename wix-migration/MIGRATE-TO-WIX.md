# Prepare entire site for Wix — 220 BioWorX

**Source (current live):** GitHub Pages → `www.220bioworx.com`  
**Repo:** `Desktop\220bioworx-landing`  
**Target:** Full site on **Wix** (Wix Stores + Members + custom compliance)  
**Prepared:** 2026-07-29  

This folder is your **migration kit**. Keep the GitHub site running until Wix is fully built, tested, and DNS is switched.

---

## 1. Why this is not a “copy HTML” move

| Current (GitHub Pages) | Wix |
|------------------------|-----|
| Hand-built HTML/CSS/JS | Editor + Wix Stores + optional Velo |
| Cart in `sessionStorage` | Native cart / checkout |
| FormSubmit email orders | Wix Forms + Wix Stores orders |
| No real user accounts | **Wix Members** (built-in logins) |
| Volume discounts in JS | Wix automatic discounts / apps |
| Zelle / ACH / crypto manual | Offline payment methods + custom flow |
| Static only | CMS, members, coupons, loyalty apps |

**Do not** expect to paste `index.html` as the whole site. Rebuild page-by-page using this kit as the **source of truth** for copy, products, rules, and compliance.

---

## 2. Site map to rebuild on Wix

| Current file | Wix page / feature | Priority |
|--------------|--------------------|----------|
| `index.html` | Home | P0 |
| Age gate (all pages) | Site-wide lightbox / Velo gate | P0 |
| RUO banner | Header master (all pages) | P0 |
| Footer legal block | Footer master | P0 |
| `#contact` inquiry form | Contact page or Home section + **Wix Form** | P0 |
| `products.html` | **Wix Stores** catalog | P0 |
| Product detail (JS modal/page) | Wix product pages | P0 |
| `cart.html` | Wix cart + checkout | P0 |
| `returns.html` | Store Policy / Returns page | P0 |
| Payments (Zelle/ACH/crypto) | Checkout payment options + policy page | P0 |
| Future: accounts | **Wix Members** | P1 |
| Future: points | Loyalty app (e.g. LoyaltyLion / Wix app market) | P1 |
| Future: promo codes | **Wix Coupons** | P1 |

### Recommended Wix page tree

```text
Home
Shop (all products)
  └─ Product pages (auto from catalog)
Cart / Checkout (Wix system)
About / RUO policy (optional)
Contact / Research inquiry
Return & Refund Policy
Payment methods (Zelle · ACH · Crypto)
Members / My Account (when enabled)
Legal footer links
```

---

## 3. Migration kit contents

```text
wix-migration/
  MIGRATE-TO-WIX.md          ← this plan
  catalog-export.csv         ← all SKUs for product setup
  brand-colors.txt           ← colors + fonts
  CHECKLIST.md               ← day-by-day build checklist
  FEATURE-MAP.md             ← each feature → how to do it on Wix
  DNS-CUTOVER.md             ← domain switch without long downtime
  COPY-SNIPPETS.md           ← required legal / RUO text blocks
  assets-to-upload/
    logo-header.png
    logo-main.jpg
    logo-main-transparent.png
    logo-hex.png
    favicon.ico / favicon-32 / apple-touch-icon
    products/*.jpeg          ← product photos
```

Regenerate catalog anytime:

```powershell
cd "$env:USERPROFILE\Desktop\220bioworx-landing"
node scripts/export-wix-catalog.js
```

---

## 4. Business rules that must survive the move

### Catalog & pricing
- Prices are **USD per vial** (see `catalog-export.csv`)
- **KPV** (`KPV-10`) is `listed: no` — keep **hidden / draft** until photo ready
- RUO language only — no dosing for humans, no wellness claims

### Volume discounts (current site)
| Total vials in cart | Discount |
|---------------------|----------|
| 3+ | 10% |
| 5+ | 20% |
| 10+ | 30% |

On Wix: use **automatic discounts** (Buy X / cart quantity rules) or a pricing app. Recreate the same tiers.

### Shipping
- Flat **$18** — 2–3 Day  
- **Free** when merchandise (after volume discount) **> $250**  
- Aim to ship within **72 hours of confirmed payment**

### Payment methods (no cards / PayPal / Venmo / Cash App on current policy)
| Method | Details (do not put banking on marketing pages only) |
|--------|------------------------------------------------------|
| **Zelle** | Recipient: 220 BioWorX · Send to: Customerservice@220bioworx.com · Memo = order # |
| **ACH** | Account name: 220 Tech · Bank: Wells Fargo · Routing: 063107513 · Account: 2215689676 · Business checking |
| **Crypto** | NOWPayments hosted invoice (manual or Worker later) |

On Wix: enable **manual / offline payments** (or “Bank transfer”) labeled Zelle & ACH; crypto as custom instructions or external link. Do **not** rely on Wix card checkout if policy forbids cards.

### Checkout attestation (required)
Buyer must select institution type(s) + confirm:
- 21+  
- Research Use Only / not for human or veterinary use  

On Wix: **checkout custom fields** (Velo / additional info) or a pre-checkout form that gates “Place order”.

### Contacts
| Role | Email |
|------|--------|
| Customer service / Zelle | Customerservice@220bioworx.com |
| Owner (internal BCC only) | Owner@220bioworx.com |

---

## 5. Product catalog snapshot

Import from `catalog-export.csv`. Listed products (as of export):

| SKU | Name | Price |
|-----|------|------:|
| RETA-30 | Reta (GLP-3 RT) 30 mg | $140 |
| GLP2-TR-40 | GLP-2 TR 40 mg | $150 |
| BPC-157-10 | BPC-157 10 mg | $40 |
| TB-500-10 | TB-500 10 mg | $60 |
| KLOW-80 | KLOW Blend | $80 |
| GHK-CU-100 | GHK-Cu | $50 |
| CJC-IPA-20 | CJC-1295 (No DAC) + Ipamorelin | $100 |
| MOTSC-40 | MOTS-c 40 mg | $75 |
| NAD-1000 | NAD+ | $80 |
| WOLVERINE | Wolverine Stack | $100 |
| NAD-GHK | NAD+ + GHK-Cu Bundle | $130 |
| RETA-KLOW | Reta + KLOW Bundle | $200 |
| KPV-10 | KPV 10 mg | $50 (**draft / hidden**) |

**Every product description must include RUO disclaimer** (column in CSV).

---

## 6. Phased plan

### Phase 0 — Prepare (this week) ✅ kit
- [x] Export catalog CSV  
- [x] Bundle logos + product images  
- [x] Document rules, legal, DNS  
- [ ] Create / open Wix account (Business or higher if Stores + Members)  
- [ ] Decide plan: **Wix Stores** + **Members Area**  

### Phase 1 — Build on Wix (no domain switch yet)
1. Theme: dark carbon + orange (`brand-colors.txt`)  
2. Upload assets from `assets-to-upload/`  
3. Create all pages in site map  
4. Add products from CSV + photos  
5. Shipping rules + volume discounts  
6. Offline payment methods (Zelle, ACH, crypto notes)  
7. Age gate + RUO banner + footer  
8. Contact form → Customerservice@  
9. Returns policy page  
10. Test checkout with **test order** on free Wix URL  

### Phase 2 — Members / loyalty / coupons (can start before or after cutover)
1. Enable **Wix Members** (signup/login)  
2. **Coupons** for discount codes  
3. Loyalty / points app (1 pt per $1 after paid)  
4. Member-only pricing optional later  

### Phase 3 — DNS cutover
See `DNS-CUTOVER.md`.  
1. Connect `220bioworx.com` / `www` to Wix  
2. Publish Wix site live  
3. Disable or leave GitHub Pages as backup (remove CNAME when ready)  
4. Update NOWPayments success/cancel URLs if used  
5. Update FormSubmit `_next` if any legacy forms remain  

### Phase 4 — Decommission GitHub storefront
1. Confirm Wix traffic 48–72h  
2. Archive repo (keep for legal copy history)  
3. Optional: GitHub Pages offline or single “moved” notice  

---

## 7. What Wix gives you “for free” vs custom

| Need | Wix native | Custom (Velo / app) |
|------------------|---------------------|
| Product catalog | ✅ Stores | — |
| Cart / tax / shipping | ✅ | — |
| User accounts | ✅ Members | — |
| Discount codes | ✅ Coupons | — |
| Loyalty points | ⚠️ App market | Or external loyalty |
| 21+ age gate | — | ✅ Lightbox + Velo |
| RUO attestation at checkout | Partial | ✅ Custom fields |
| Zelle / ACH offline | ✅ Manual payments | Instructions text |
| NOWPayments crypto | — | Link / external invoice |
| Hide pay details until method chosen | Harder | Custom checkout UI |
| Stay on-site email invoices | Wix emails | Optional automation |

---

## 8. Compliance (do not drop on Wix)

Same rules as current site:

1. **21+** age gate before browsing shop  
2. Persistent **Research Use Only** banner  
3. **Not for human / veterinary use**  
4. **Not FDA approved**  
5. **Not 503A / not 503B** compounding pharmacy  
6. No human health claims, dosing for people, before/after  
7. Returns: all sales final once shipped (see current `returns.html`)  
8. Counsel review of marketing copy still recommended  

---

## 9. Email & ops after Wix

| Task | On Wix |
|------|--------|
| New store order | Wix dashboard → Orders |
| Inquiry form | Wix Forms inbox / email |
| Mark paid (Zelle/ACH) | Order status → Paid / fulfill |
| Crypto | Create NOWPayments invoice using order #; paste link in order notes / email |
| Owner BCC | Configure notification emails carefully so Owner isn’t exposed to buyers if using shared threads |

Keep a spreadsheet until loyalty is automated: `Order # | Method | Amount | Status | Points`.

---

## 10. Risks & decisions to make now

| Decision | Options |
|----------|---------|
| **Plan tier** | Need Stores (+ Members for accounts). Confirm current Wix subscription. |
| **Cards** | Current policy: no cards. Turn off Wix Payments card checkout if that remains policy. |
| **Guest checkout** | Recommended **on** for B2B; Members for points. |
| **Crypto** | Manual NOWPayments link in order email vs deep integration. |
| **Domain** | Domain may still be managed at Wix DNS or registrar—follow `DNS-CUTOVER.md`. |
| **GitHub** | Freeze big feature work on GH; only critical fixes until cutover. |

---

## 11. Source files (reference while building)

| Need | File |
|------|------|
| Home + gate + legal + contact | `index.html` |
| Catalog UI | `products.html` |
| Product data | `products-data.js` / `catalog-export.csv` |
| Cart / checkout logic | `cart.html`, `cart.js`, `payment-config.js` |
| Returns | `returns.html` |
| Payments docs | `PAYMENTS.md`, `CRYPTO-NOWPAYMENTS.md` |
| Ops | `ORDERS-OPS.md` |

---

## 12. Success criteria (go-live on Wix)

- [ ] Age gate works on mobile + desktop  
- [ ] All listed products + images live  
- [ ] Volume discounts match table  
- [ ] Shipping $18 / free > $250  
- [ ] Zelle + ACH + crypto instructions work without showing bank details on Home  
- [ ] RUO attestation required before complete order  
- [ ] Returns page linked in footer + checkout  
- [ ] Test order received; CS email works  
- [ ] `www.220bioworx.com` serves Wix (HTTPS)  
- [ ] GitHub store no longer primary  

---

**Next action:** Open Wix → create site → follow `CHECKLIST.md` in order.  
Use this repo only as content/source; do not keep two competing live checkouts after DNS cutover.

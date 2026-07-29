# Wix build checklist — 220 BioWorX

Work top to bottom. Check boxes in Wix as you go.  
**Do not switch DNS until “Pre-cutover tests” all pass.**

---

## A. Account & plan

- [ ] Wix account owns domain intent for `220bioworx.com`
- [ ] Plan supports **Wix Stores** (and later **Members**)
- [ ] New site created (or empty site ready) — name: 220 BioWorX
- [ ] Preview URL noted: `https://_____.wixsite.com/_____`
- [ ] Team access: Owner@ / CS if needed

---

## B. Brand & global design

- [ ] Upload logos from `assets-to-upload/`
- [ ] Favicon set
- [ ] Site colors: carbon `#080B0D`, orange `#FF5A00` (see `brand-colors.txt`)
- [ ] Fonts: Poppins (headings) + Inter (body) if available, or close substitutes
- [ ] Dark theme site-wide
- [ ] Header: logo → Home, Shop, Contact, Cart, (Account later)
- [ ] Sticky or top **RUO banner** on all pages
- [ ] Footer master: copyright + legal disclosures (`COPY-SNIPPETS.md`)
- [ ] Footer links: Home, Shop, Returns, Contact, Payment methods

---

## C. Pages

- [ ] **Home** — hero, RUO positioning, CTA “Review catalog” / Shop, no human-use claims
- [ ] **Shop** — Wix product gallery
- [ ] **Contact / Research inquiry** — Wix Form
- [ ] **Returns / Refund Policy** — paste from current `returns.html`
- [ ] **Payment methods** — Zelle / ACH / Crypto overview (no need to put full ACH on Home)
- [ ] **Cart / Checkout** — Wix system pages enabled
- [ ] Optional **About / Compliance** page

---

## D. Catalog (from `catalog-export.csv`)

For each **listed** SKU:

- [ ] Create product (name, SKU, price, description)
- [ ] Upload primary + secondary product images
- [ ] Category set (e.g. Incretin-pathway / Synthetic peptide / Bundles)
- [ ] Additional info: strength, storage, scientific name
- [ ] RUO disclaimer in description
- [ ] Inventory: unlimited or your stock counts
- [ ] Visible in shop

Special:

- [ ] **KPV-10** created as **Hidden / Draft** only
- [ ] Bundles (Wolverine, NAD+GHK, Reta+KLOW) listed with component notes

---

## E. Pricing & shipping

- [ ] Currency: USD
- [ ] Volume discount rules:
  - [ ] 3+ vials → 10%
  - [ ] 5+ vials → 20%
  - [ ] 10+ vials → 30%
- [ ] Shipping region(s) configured (start: US if that’s your policy)
- [ ] Flat rate **$18** (2–3 Day label)
- [ ] Free shipping over **$250** merchandise (match current rule as closely as Wix allows)
- [ ] Checkout note: ship within **72h of confirmed payment**

---

## F. Payments

- [ ] Confirm policy: **no cards / PayPal / Venmo / Cash App** (or change policy deliberately)
- [ ] Manual payment: **Zelle** — instructions with Customerservice@220bioworx.com
- [ ] Manual payment: **ACH** — 220 Tech / Wells Fargo details (checkout only)
- [ ] Manual / custom: **Cryptocurrency (NOWPayments)** — “Invoice link emailed after order”
- [ ] Order confirmation email includes: order #, total, pay method, “reply with proof of payment”
- [ ] Staff notification → Customerservice@220bioworx.com
- [ ] Owner notifications internal only (not buyer-visible CC if avoidable)

---

## G. Compliance gates

- [ ] **Age gate** (21+) before site or before Shop — lightbox / Velo
- [ ] Session or cookie so gate isn’t every click, but returns each session if desired
- [ ] Exit / leave site control
- [ ] Checkout fields:
  - [ ] Institution / organization
  - [ ] Buyer type checkboxes (or multi-select)
  - [ ] RUO attestation required checkbox
- [ ] Form inquiry: RUO checkbox required

---

## H. Forms & email

- [ ] Contact form fields: name, org, email, role, message, RUO checkbox
- [ ] Submissions to Customerservice@220bioworx.com
- [ ] Test submission received
- [ ] Auto-reply optional (no medical claims)

---

## I. Members / coupons / points (Phase 2 — can wait)

- [ ] Enable **Wix Members**
- [ ] Sign up / login pages
- [ ] Guest checkout still allowed
- [ ] Create first **coupon** (test code)
- [ ] Install loyalty app OR document manual points until app is ready
- [ ] Rule draft: 1 point per $1 **after paid**

---

## J. Pre-cutover tests (on Wix preview URL)

- [ ] Mobile age gate
- [ ] Desktop age gate
- [ ] Add 1 product → cart total correct
- [ ] Add 3 vials → 10% off
- [ ] Add 5 vials → 20% off
- [ ] Add 10 vials → 30% off
- [ ] Cart under $250 → $18 shipping
- [ ] Cart over $250 merchandise → free shipping
- [ ] Checkout Zelle path → order appears in dashboard
- [ ] Checkout ACH path
- [ ] Checkout crypto path (instructions present)
- [ ] Cannot complete without RUO attestation
- [ ] Returns page reachable
- [ ] No human-use / dosing language on product pages
- [ ] Favicon + logo correct

---

## K. DNS cutover (see `DNS-CUTOVER.md`)

- [ ] Connect domain in Wix
- [ ] DNS records updated
- [ ] HTTPS / SSL active on www
- [ ] Publish production
- [ ] Spot-check live URLs
- [ ] GitHub Pages CNAME removed or Pages disabled when stable
- [ ] Update any NOWPayments / external links to Wix URLs

---

## L. Post-launch

- [ ] CS trained on Wix Orders dashboard
- [ ] Mark paid workflow for Zelle/ACH/crypto
- [ ] 48h dual-watch (email + Wix)
- [ ] Archive GitHub as read-only reference
- [ ] Optional: enable Members + coupons for customers

---

## Freeze rule (during build)

**Do not** add major new features on GitHub Pages except critical bugfixes.  
All new work goes into Wix so you don’t migrate twice.

# Feature map: GitHub site → Wix

## Core storefront

| Feature today | Wix approach |
|---------------|--------------|
| Product list (`products-data.js`) | **Wix Stores → Products** (use `catalog-export.csv`) |
| Product images | Media Manager → product gallery |
| Product detail + specs | Product page + additional info tabs / description HTML |
| Add to cart | Native add-to-cart |
| Cart (`cart.js` sessionStorage) | Native cart |
| Cart reference `BW-…` | Wix **order number** (or add custom field “PO / reference”) |
| Empty cart after order | Native (order completed) |

## Pricing

| Feature today | Wix approach |
|---------------|--------------|
| Unit prices | Product price |
| Volume 10/20/30% by vial count | **Marketing → Coupons & Discounts → Automatic discount** by quantity, or app that supports cart quantity tiers |
| Shipping $18 | Shipping rule flat rate |
| Free ship over $250 | Free shipping rule by order subtotal (verify whether Wix uses pre/post discount; match as closely as possible) |

## Payments

| Feature today | Wix approach |
|---------------|--------------|
| Method pick: Zelle / ACH / Crypto | Checkout **payment methods** = 3 manual options with instruction text |
| Hide bank details until checkout | Put full ACH/Zelle only in payment method instructions, not on Home |
| Stay on site (no FormSubmit leave) | Native Wix checkout (stays on your Wix domain) |
| Email invoice + pay instructions | Wix order confirmation + custom email template |
| FormSubmit / Owner BCC | Replace with Wix notifications; set staff emails carefully |
| NOWPayments | After order: CS creates invoice using order #; email link; optional future Velo/HTTP to Worker |

## Compliance

| Feature today | Wix approach |
|---------------|--------------|
| 21+ age gate | **Lightbox** on load + Velo/`localStorage`/`sessionStorage` flag |
| RUO banner | Header strip element on master page |
| Footer legal | Footer master (all pages) |
| Checkout RUO attestation | Checkout form fields / “additional info” required |
| Institution type checkboxes | Multi-checkbox custom field or “Order notes” structured text |
| Returns policy | Dedicated page + link in checkout policies |

## Accounts, points, codes (your goals)

| Feature | Wix approach |
|---------|--------------|
| Create account / login | **Wix Members** (Members Area app) |
| Profile / org | Member fields / contacts |
| Order history | My Orders (Members + Stores) |
| Discount codes | **Coupons** (percent / fixed, limits, dates) |
| Points per $1 spent | **Loyalty app** from Wix App Market, or manual until app chosen |
| Earn only after paid | Configure app for “completed/paid orders” only; offline pay = mark paid in dashboard first |
| Guest checkout | Keep enabled so B2B isn’t blocked |

### Suggested loyalty settings (configure in app)

- Earn: 1 point per $1 merchandise paid  
- Redeem: e.g. 100 points = $1  
- No earn on shipping  
- Reverse on refund  

## Contact / marketing

| Feature today | Wix approach |
|---------------|--------------|
| Research inquiry form | **Wix Forms** |
| FormSubmit endpoint | Remove after cutover |
| Age gate on contact | Same site-wide gate |

## What will **not** port 1:1

| Item | Note |
|------|------|
| Custom JS cart math | Rebuilt with Wix discounts |
| `payment-config.js` | Becomes Wix settings + email templates |
| Cloudflare invoice worker | Optional later; not required for day-1 Wix |
| Exact carbon CSS | Recreate with theme + custom CSS where allowed |
| FormSubmit AJAX | Retired |

## Recommended Wix apps (evaluate)

| Need | Search for |
|------|------------|
| Loyalty points | Loyalty / rewards apps compatible with Stores |
| Advanced quantity discounts | Wholesale / quantity break apps if native rules insufficient |
| Age verification | Age gate / 21+ popup apps **or** simple Velo lightbox |
| Crypto | Usually external (NOWPayments), not a full Wix crypto gateway |

Always check app supports **manual/offline payments** if points should fire when you mark Zelle paid.

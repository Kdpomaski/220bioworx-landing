# 220 BioWorX — Payments

## Public policy
- **Zelle** and **ACH only**
- **No banking / Zelle credentials on marketing pages**
- Buyer selects method in **cart checkout** (`cart.html`)
- Instructions appear:
  1. On-screen after “Request invoice”
  2. At the **top** of the order email to CS (CC Owner), followed by cart / invoice details

## Where secrets live
Edit: **`payment-config.js`**

```js
window.BW_PAYMENT = {
  zelle: { recipientName, sendTo, memo },
  ach: { accountName, bankName, routing, account, accountType },
  formSubmitEndpoint: "https://formsubmit.co/<hash>",
  ownerCc: "Owner@220bioworx.com",
  discounts: [ { minQty: 10, pct: 20 }, ... ],
};
```

Do **not** put routing/account/Zelle send-to on `products.html` or `index.html`.

## Cart flow
1. Items in `sessionStorage` via `cart.js` (`BWCart`)
2. Cart reference e.g. `BW-250726-AB12`
3. Select **Zelle** or **ACH**
4. Submit → FormSubmit email:
   - Payment instructions for selected method (top)
   - Shopping cart / invoice lines, discounts, total, reference
   - Buyer info + RUO attestation
5. Buyer also sees the same payment block on the confirmation panel

## Volume discounts (cart totals)
| Total vials | Discount |
|-------------|----------|
| 3+ | 10% |
| 5+ | 15% |
| 10+ | 20% |

Applied as: `unit price × qty`, then volume % off subtotal.

## Deploy
```powershell
cd "$env:USERPROFILE\Desktop\220bioworx-landing"
git add .
git commit -m "Update payments"
git push
```

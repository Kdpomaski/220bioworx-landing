# DNS cutover: GitHub Pages → Wix

**Goal:** `www.220bioworx.com` (and apex if used) serves the **Wix** site with minimal downtime.

Current production is **GitHub Pages** (`CNAME` file = `www.220bioworx.com`).

---

## Before you touch DNS

1. Wix site is **fully built** and tested on the free `wixsite.com` URL.  
2. All checklist “Pre-cutover tests” pass.  
3. You know where DNS is controlled (Wix Domains vs GoDaddy vs Cloudflare vs other).  
4. You can log into that DNS host **and** Wix.

---

## Recommended sequence

### 1. Connect domain in Wix (do not remove GitHub yet)

1. Wix → **Settings → Domains** → **Connect existing domain**  
2. Enter `220bioworx.com` / `www.220bioworx.com`  
3. Wix shows required records (often):

**Typical Wix pattern (confirm in your Wix panel — values change):**

| Host | Type | Value (example only) |
|------|------|----------------------|
| `www` | CNAME | `www##.wixdns.net` (Wix will show exact) |
| `@` | A / pointing | Wix A records or nameservers |

Some setups ask you to **point nameservers to Wix**. Prefer **connect with DNS records** if you want more control.

### 2. Lower TTL (optional, 24h before)

If your DNS host allows, set TTL on `www` / `@` to **300 seconds** a day before cutover so rollback is faster.

### 3. Update DNS records

1. **Remove or replace** the GitHub Pages targets:
   - CNAME `www` → `*.github.io`  
   - Apex A records `185.199.108.153` etc. (GitHub)  
2. **Add** exact records Wix displays.  
3. Save. Propagation: minutes to 48 hours (often under 1 hour).

### 4. Publish Wix + assign primary domain

1. Wix → Publish  
2. Set **primary domain** to `www.220bioworx.com`  
3. Enable SSL (Wix usually auto-provisions)

### 5. Verify

```text
https://www.220bioworx.com
https://www.220bioworx.com/  (shop path on Wix)
```

- [ ] Site is Wix (not old GitHub cart/products HTML)  
- [ ] HTTPS padlock works  
- [ ] Age gate appears  
- [ ] Test product + checkout  

### 6. GitHub Pages cleanup (after 48–72h stable)

1. Repo → Settings → Pages → **Disable** or remove custom domain  
2. Remove or empty `CNAME` file in repo (commit) so GH doesn’t reclaim domain  
3. Keep repo archived as content backup  

### 7. External URL updates

| System | Update |
|--------|--------|
| NOWPayments success/cancel | New Wix cart/thank-you URLs if used |
| Email signatures / ads | Confirm www points to Wix |
| Google Search Console | Re-verify property if needed |
| FormSubmit `_next` | Only if any form still on GH |

---

## Rollback plan

If Wix is broken after cutover:

1. DNS: restore `www` CNAME to `YOURUSER.github.io`  
2. Restore GitHub Pages custom domain + `CNAME` file  
3. Wait for TTL  
4. Fix Wix offline, then cut over again  

Keep the GitHub repo **deployable** until you’re confident.

---

## Email (MX) warning

**Do not change MX records** when moving the website unless Wix email is intentional.

Website DNS (A/CNAME) ≠ mail DNS (MX).  
`Customerservice@220bioworx.com` must keep working. If unsure, screenshot all DNS records before editing.

---

## Split traffic tip

Optional soft launch:

1. Build on `shop.220bioworx.com` or Wix free URL first  
2. Share with internal testers  
3. Then point `www` when ready  

---

## Status log (fill in during cutover)

| Step | Date/time | Owner | Done |
|------|-----------|-------|------|
| Wix site ready | | | [ ] |
| DNS records updated | | | [ ] |
| www resolves to Wix | | | [ ] |
| SSL OK | | | [ ] |
| Test order live | | | [ ] |
| GitHub Pages disabled | | | [ ] |

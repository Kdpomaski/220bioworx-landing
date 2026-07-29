# Hide personal GitHub name from the public site

**Problem:** Public DNS currently shows:

```text
www.220bioworx.com  →  CNAME  →  kdpomaski.github.io
```

Anyone looking up the domain can see the GitHub username.  
The repo is also **public** at `github.com/Kdpomaski/220bioworx-landing`.

**Goal:** Outsiders see only **220bioworx.com** (and generic hosting), not your personal name.

---

## What we will change

| Layer | Action | Who |
|-------|--------|-----|
| **1. DNS (quick win)** | Point `www` at GitHub **A records** (no username in DNS) | You in **Wix Domains** (5 min) |
| **2. Cloudflare (recommended)** | Proxy traffic so public DNS shows Cloudflare, not GitHub | You create free CF account; we configure records |
| **3. GitHub org** | Move site repo under a **brand org** (not personal username) | You approve org name; we transfer if possible |
| **4. Repo privacy** | Private repo (needs GitHub Pro for private Pages) | Optional later |

**Do not change MX records** — mail uses Google (`aspmx.l.google.com`). Only website records change.

---

## Step 1 — Immediate: remove username from DNS (Wix)

Log into **Wix → Domains → 220bioworx.com → DNS / Manage DNS records**.

### Find and remove
- Any **CNAME** for `www` pointing to `kdpomaski.github.io` (or similar)

### Add instead (www → GitHub Pages IPs, no username)

| Type | Host name | Value | TTL |
|------|-----------|--------|-----|
| **A** | `www` | `185.199.108.153` | Default |
| **A** | `www` | `185.199.109.153` | Default |
| **A** | `www` | `185.199.110.153` | Default |
| **A** | `www` | `185.199.111.153` | Default |

If the **apex** (`@` / `220bioworx.com`) also points at GitHub, use the **same four A records** (not a CNAME to github.io).

### Leave alone
- **MX** → Google (aspmx…, alt1…, etc.)
- **TXT** for Google/email verification
- Any SPF/DKIM/DMARC for mail

### Verify (after 5–60 min)
```powershell
nslookup www.220bioworx.com
```
You should see **only** `185.199.x.x` addresses — **not** `kdpomaski.github.io`.

Site should still load: https://www.220bioworx.com

---

## Step 2 — Cloudflare proxy (hides GitHub in headers too)

After Step 1, experts can still see `Server: GitHub.com`. Cloudflare fixes that.

1. Create free account: https://dash.cloudflare.com/sign-up  
2. **Add site** → `220bioworx.com`  
3. Plan: **Free**  
4. Cloudflare scans DNS — **check every record**, especially all **MX** for Google  
5. Cloudflare shows two nameservers, e.g.:
   - `ada.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`
6. In **Wix Domains**, change nameservers from:
   - `ns0.wixdns.net` / `ns1.wixdns.net`  
   to the two Cloudflare nameservers  
7. In Cloudflare DNS for `www`:
   - Prefer **CNAME** `www` → `kdpomaski.github.io` **OR** A records to `185.199.x.x`
   - Turn **Proxy status: Proxied** (orange cloud) **ON**
8. SSL/TLS mode: **Full** (not “Flexible”)
9. Wait for “Active” on Cloudflare

Public then sees Cloudflare IPs; `Server: cloudflare`. Username not in public DNS.

**Send us the two Cloudflare nameservers once shown** if you want a record-by-record review before switching NS.

---

## Step 3 — Brand GitHub org (hides name if origin is probed)

Even with Cloudflare, a determined person might find a public repo under `Kdpomaski`.

1. Create org: https://github.com/organizations/plan  
   Suggested name: **`220bioworx`** or **`bioworx220`** (must be available)
2. Transfer repo `220bioworx-landing` → that org  
3. Re-enable GitHub Pages on the org repo (custom domain `www.220bioworx.com`)  
4. If DNS still has a CNAME to github.io, point it at **`ORGNAME.github.io`**, not the personal account  
5. With Cloudflare proxy, even that CNAME stays private from the public

---

## Step 4 — Optional: private repository

- Free GitHub: Pages generally needs a **public** repo  
- **GitHub Pro** (~$4/mo): Pages from **private** repo  
- Strongest “source not browsable” option

---

## Checklist

- [ ] Wix: remove CNAME to `*.github.io`  
- [ ] Wix: four A records for `www` (Step 1)  
- [ ] `nslookup` no longer shows personal username  
- [ ] Site loads over HTTPS  
- [ ] MX still Google; email works  
- [ ] Cloudflare account + site added (optional but recommended)  
- [ ] NS switched only after MX confirmed in CF  
- [ ] Proxy orange on `www`  
- [ ] Org transfer (recommended)  
- [ ] Repo private if on Pro (optional)  

---

## What this does / does not do

| Hidden from casual lookup | Still possible for experts |
|---------------------------|----------------------------|
| Username in DNS CNAME | Historical DNS databases |
| Direct `github.io` alias | Guessing origin if misconfigured |
| With CF: `Server: GitHub.com` | Legal WHOIS if no privacy (separate) |
| With org: personal login on repo URL | — |

WHOIS registrant name is separate — enable **domain privacy** at the registrar/Wix if offered.

---

## Rollback

Restore CNAME `www` → `kdpomaski.github.io` (or org `.github.io`) and remove the four A records if something breaks. Mail: never delete MX.

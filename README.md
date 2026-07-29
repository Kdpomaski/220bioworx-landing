# 220 BioWorX — Research Use Only Landing Page

Static site for **www.220bioworx.com** hosted on **GitHub Pages**.

## Moving to Wix

Full migration kit (catalog CSV, assets, checklists, DNS cutover):

**`wix-migration/`** → start with [`wix-migration/MIGRATE-TO-WIX.md`](wix-migration/MIGRATE-TO-WIX.md)

Regenerate product CSV:

```powershell
node scripts/export-wix-catalog.js
```

Keep this GitHub site live until Wix is tested and DNS is switched (`wix-migration/DNS-CUTOVER.md`).

## Live files

| File | Purpose |
|------|---------|
| `index.html` | Full landing page + 21+ age gate + RUO disclosures |
| `logo-header.png` | Primary brand logo |
| `logo-hex.png` | Hex mark (footer) |
| `CNAME` | Custom domain → `www.220bioworx.com` |
| `.nojekyll` | Serve files as plain static HTML |

## How it works

1. **GitHub Pages** serves this HTML from the `main` branch (`/` root).
2. **DNS** at your domain registrar points `www` (and optionally the apex) to GitHub.
3. Visitors open `https://www.220bioworx.com` → age gate → site.

No Wix hosting required for this page.

## Deploy (first time)

```powershell
# 1. Log in (browser)
gh auth login

# 2. From this folder
cd "$env:USERPROFILE\Desktop\220bioworx-landing"

# 3. Create public repo + push (change OWNER if needed)
gh repo create 220bioworx-landing --public --source=. --remote=origin --push

# 4. Enable Pages (root of main)
gh api -X POST "repos/{owner}/220bioworx-landing/pages" -f build_type=legacy -f source[branch]=main -f source[path]=/
```

Or in the browser: **Repo → Settings → Pages → Deploy from branch `main` / `/ (root)` → Save**.

Temporary URL:

`https://YOUR_GITHUB_USERNAME.github.io/220bioworx-landing/`

With the `CNAME` file and DNS set, production URL:

`https://www.220bioworx.com`

## DNS — point domain to GitHub (the “redirect”)

At the place that controls **220bioworx.com** DNS (Wix Domains, GoDaddy, Namecheap, etc.):

### A) `www` (recommended)

| Type | Name | Value |
|------|------|--------|
| **CNAME** | `www` | `YOUR_GITHUB_USERNAME.github.io` |

### B) Apex / root (`220bioworx.com` → same site)

GitHub Pages A records (use all four):

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `185.199.108.153` |
| **A** | `@` | `185.199.109.153` |
| **A** | `@` | `185.199.110.153` |
| **A** | `@` | `185.199.111.153` |

Also add both domains under **Repo → Settings → Pages → Custom domain** → `www.220bioworx.com` (and optionally `220bioworx.com`). Enable **Enforce HTTPS** after DNS verifies.

### If domain is still on Wix

1. Wix → **Settings → Domains** → disconnect or stop using Wix nameservers for hosting this site  
2. Or keep Wix DNS and only change the **records above** so traffic goes to GitHub instead of Wix  

Until DNS updates (minutes–48h), you may still see the old Wix “Connect domain” page.

## Update the site later

```powershell
cd "$env:USERPROFILE\Desktop\220bioworx-landing"
git add .
git commit -m "Update landing page"
git push
```

GitHub Pages rebuilds in ~1 minute.

## Compliance note

Research Use Only site. Age gate + legal footer are in `index.html`. Have counsel review before marketing claims change.

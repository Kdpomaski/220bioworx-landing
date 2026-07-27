from pathlib import Path

out = Path(__file__).resolve().parents[1] / "images" / "products"
out.mkdir(parents=True, exist_ok=True)

items = [
    ("glp3-rt-30", "GLP-3 RT"),
    ("tirz-40", "TIRZ"),
    ("bpc-157-10", "BPC-157"),
    ("tb-500-10", "TB-500"),
    ("klow-80", "KLOW"),
    ("kpv-10", "KPV"),
    ("cjc-ipa-20", "CJC+IPA"),
    ("mots-c-40", "MOTS-c"),
    ("ss-31-10", "SS-31"),
    ("nad-1000", "NAD+"),
]

for sku, lab in items:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1C1F22"/>
      <stop offset="100%" stop-color="#080B0D"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <rect x="80" y="80" width="640" height="640" rx="24" fill="none" stroke="#FF5A00" stroke-width="3" opacity="0.5"/>
  <circle cx="400" cy="340" r="90" fill="none" stroke="#70777D" stroke-width="8"/>
  <rect x="360" y="250" width="80" height="120" rx="8" fill="#4C5A3A" opacity="0.9"/>
  <rect x="370" y="240" width="60" height="20" rx="4" fill="#FF5A00"/>
  <text x="400" y="500" text-anchor="middle" font-family="Segoe UI, Arial" font-size="36" font-weight="700" fill="#FFFFFF">{lab}</text>
  <text x="400" y="550" text-anchor="middle" font-family="Segoe UI, Arial" font-size="20" fill="#70777D">RESEARCH USE ONLY</text>
  <text x="400" y="600" text-anchor="middle" font-family="Segoe UI, Arial" font-size="16" fill="#4C5A3A">Image coming soon</text>
</svg>
"""
    (out / f"{sku}.svg").write_text(svg, encoding="utf-8")

print("wrote", len(items), "placeholders to", out)

/**
 * 220 BioWorX cart — sessionStorage backed.
 * Line item: { id, name, sku, unitPrice, qty, unit: "vial" }
 */
(function (global) {
  const KEY = "bw220_cart_v1";

  function read() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (_) {
      return [];
    }
  }

  function write(items) {
    sessionStorage.setItem(KEY, JSON.stringify(items));
    global.dispatchEvent(new CustomEvent("bw-cart-updated", { detail: { items } }));
  }

  function totalVials(items) {
    return items.reduce((n, i) => n + (Number(i.qty) || 0), 0);
  }

  function discountPct(vials) {
    const tiers = (global.BW_PAYMENT && global.BW_PAYMENT.discounts) || [];
    for (const t of tiers) {
      if (vials >= t.minQty) return t.pct;
    }
    return 0;
  }

  function totals(items) {
    const subtotal = items.reduce(
      (s, i) => s + (Number(i.unitPrice) || 0) * (Number(i.qty) || 0),
      0
    );
    const vials = totalVials(items);
    const pct = discountPct(vials);
    const discountAmount = Math.round(subtotal * (pct / 100) * 100) / 100;
    const total = Math.round((subtotal - discountAmount) * 100) / 100;
    return { subtotal, vials, pct, discountAmount, total };
  }

  function money(n) {
    return "$" + (Number(n) || 0).toFixed(2);
  }

  function formatCartText(items, ref) {
    const t = totals(items);
    const lines = [
      "SHOPPING CART / INVOICE DETAILS",
      "Reference: " + (ref || "—"),
      "--------------------------------",
    ];
    if (!items.length) {
      lines.push("(Cart is empty)");
    } else {
      items.forEach((i, idx) => {
        const line = (Number(i.unitPrice) || 0) * (Number(i.qty) || 0);
        lines.push(
          idx +
            1 +
            ") " +
            i.name +
            (i.sku ? " [" + i.sku + "]" : "") +
            " — " +
            i.qty +
            " " +
            (i.unit || "vial") +
            " × " +
            money(i.unitPrice) +
            " = " +
            money(line)
        );
      });
    }
    lines.push("--------------------------------");
    lines.push("Total vials: " + t.vials);
    lines.push("Subtotal: " + money(t.subtotal));
    if (t.pct > 0) {
      lines.push("Volume discount (" + t.pct + "%): −" + money(t.discountAmount));
    } else {
      lines.push("Volume discount: none (3+ vials 10%, 5+ 15%, 10+ 20%)");
    }
    lines.push("ORDER TOTAL: " + money(t.total));
    lines.push("--------------------------------");
    lines.push("Research Use Only. Not for human use.");
    return lines.join("\n");
  }

  const api = {
    KEY,
    getItems: read,
    setItems: write,
    clear() {
      write([]);
    },
    count() {
      return totalVials(read());
    },
    add(item) {
      const items = read();
      const id = item.id || item.sku || item.name;
      const existing = items.find((x) => x.id === id);
      if (existing) {
        existing.qty = (Number(existing.qty) || 0) + (Number(item.qty) || 1);
      } else {
        items.push({
          id,
          name: item.name || "Research item",
          sku: item.sku || "",
          unitPrice: Number(item.unitPrice) || 0,
          qty: Number(item.qty) || 1,
          unit: item.unit || "vial",
        });
      }
      write(items);
      return items;
    },
    updateQty(id, qty) {
      let items = read();
      qty = Math.max(0, Math.floor(Number(qty) || 0));
      items = items
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0);
      write(items);
      return items;
    },
    remove(id) {
      write(read().filter((i) => i.id !== id));
    },
    totals: () => totals(read()),
    formatCartText,
    money,
    newReference() {
      const d = new Date();
      const p =
        d.getFullYear().toString().slice(2) +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
      const r = Math.random().toString(36).slice(2, 6).toUpperCase();
      return "BW-" + p + "-" + r;
    },
  };

  global.BWCart = api;
})(window);

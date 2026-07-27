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

  function shippingConfig() {
    const s = (global.BW_PAYMENT && global.BW_PAYMENT.shipping) || {};
    return {
      method: s.method || "2–3 Day shipping",
      flatRate: Number(s.flatRate) >= 0 ? Number(s.flatRate) : 18,
      freeShippingMin: Number(s.freeShippingMin) >= 0 ? Number(s.freeShippingMin) : 250,
      shipWithinHours: s.shipWithinHours || 72,
      note: s.note || "We aim to ship all orders within 72 hours of confirmed payment.",
    };
  }

  function totals(items) {
    const subtotal = items.reduce(
      (s, i) => s + (Number(i.unitPrice) || 0) * (Number(i.qty) || 0),
      0
    );
    const vials = totalVials(items);
    const pct = discountPct(vials);
    const discountAmount = Math.round(subtotal * (pct / 100) * 100) / 100;
    const merchandise = Math.round((subtotal - discountAmount) * 100) / 100;
    const ship = shippingConfig();
    const freeShip = merchandise >= ship.freeShippingMin;
    const shippingAmount = freeShip ? 0 : ship.flatRate;
    const shippingLabel = freeShip
      ? ship.method + " — FREE (order over $" + ship.freeShippingMin + ")"
      : ship.method + " — flat rate";
    const total = Math.round((merchandise + shippingAmount) * 100) / 100;
    return {
      subtotal,
      vials,
      pct,
      discountAmount,
      merchandise,
      shippingAmount,
      shippingLabel,
      shippingMethod: ship.method,
      freeShipping: freeShip,
      freeShippingMin: ship.freeShippingMin,
      flatRate: ship.flatRate,
      shipWithinHours: ship.shipWithinHours,
      shippingNote: ship.note,
      total,
    };
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
      lines.push("Volume discount: none (3+ vials 10%, 5+ 20%, 10+ 30%)");
    }
    lines.push("Merchandise total: " + money(t.merchandise));
    lines.push(
      "Shipping (" +
        t.shippingMethod +
        "): " +
        (t.freeShipping ? "FREE (over $" + t.freeShippingMin + ")" : money(t.shippingAmount))
    );
    lines.push("ORDER TOTAL: " + money(t.total));
    lines.push("--------------------------------");
    lines.push(t.shippingNote);
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

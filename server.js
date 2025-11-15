import express from "express";
import fetch from "node-fetch";

const app = express();

const STOCK_URL = "https://api.joshlei.com/json";

app.get("/", async (req, res) => {
  try {
    const r = await fetch(STOCK_URL);

    if (!r.ok) {
      return res.status(r.status).json({
        error: `Remote API returned ${r.status}`,
        message: await r.text()
      });
    }

    const d = await r.json();

    const seeds = (d.seed_stock || []).map(x => x.display_name);
    const gear = (d.gear_stock || []).map(x => x.display_name);
    const eggs = (d.egg_stock || []).map(x => x.display_name);
    const events = (d.eventshop_stock || []).map(x => x.display_name);

    const merchant = d.travelingmerchant_stock?.merchantName ?? null;

    const out = { seeds, gear, eggs, events, merchant };

    res.json(out);

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});

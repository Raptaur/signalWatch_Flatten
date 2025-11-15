import express from "express";
import fetch from "node-fetch";

const app = express();

// --- Vulcan API endpoint ---
const STOCK_URL = "https://api.joshlei.com/v2/growagarden/stock";

// --- Your API key must be passed to the remote endpoint ---
// If you don’t have a key yet, this endpoint will return a 401.
// When you get the key, put it in your Render environment variables:
const API_KEY = process.env.JSTUDIO_KEY || "";

app.get("/", async (req, res) => {
  try {
    const r = await fetch(STOCK_URL, {
      headers: {
        "jstudio-key": API_KEY
      }
    });

    if (!r.ok) {
      return res.status(r.status).json({
        error: `Remote API returned ${r.status}`,
        message: await r.text()
      });
    }

    const d = await r.json();

    // d.seed_stock = [{ display_name, quantity, ... }]
    const seeds = (d.seed_stock || []).map(x => x.display_name);
    const gear = (d.gear_stock || []).map(x => x.display_name);
    const eggs = (d.egg_stock || []).map(x => x.display_name);
    const events = (d.eventshop_stock || []).map(x => x.display_name);

    // travelingmerchant_stock object exists only sometimes
    const merchant = d.travelingmerchant_stock?.merchantName ?? null;

    const out = {
      seeds,
      gear,
      eggs,
      events,
      merchant
    };

    res.json(out);

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});

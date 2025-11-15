import express from "express";
import fetch from "node-fetch";

const app = express();
const STOCK_URL = "https://gagapi.onrender.com/alldata";

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

    const out = {
      seeds: d.seeds?.map(x => x.name) ?? [],
      gear: d.gear?.map(x => x.name) ?? [],
      eggs: d.eggs?.map(x => x.name) ?? [],
      events: d.events?.map(x => x.name) ?? [],
      merchant: d.travelingMerchant?.merchantName ?? null,
      lastGlobalUpdate: d.lastGlobalUpdate ?? null   // ← *** important ***
    };

    res.json(out);

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port", process.env.PORT || 3000)
);

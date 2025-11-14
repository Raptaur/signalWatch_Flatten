import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/", async (req, res) => {
  try {
    const r = await fetch("https://gagapi.onrender.com/alldata");
    const d = await r.json();

    const out = {
      seeds: d.seeds?.map(x => x.name) ?? [],
      gear: d.gear?.map(x => x.name) ?? [],
      eggs: d.eggs?.map(x => x.name) ?? [],
      events: d.events?.map(x => x.name) ?? [],
      merchant: d.travelingMerchant?.merchantName ?? null
    };

    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port", process.env.PORT || 3000)
);

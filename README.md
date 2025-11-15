📘 SignalWatch Flattener

Flattening the Grow-A-Garden API for lightweight mobile automation
Author: Raptaur (Chris)
Purpose: Convert the complex JSON returned by the official Grow-A-Garden API into a simplified structure that MacroDroid can easily parse.


-------------------------------------------------------------------------
🌱 Overview
SignalWatch Flattener is a tiny Node.js server that fetches live Grow-A-Garden stock data and outputs a clean, minimal JSON object for automation tools (such as MacroDroid).

The official GAG API returns deeply structured data that isn’t friendly for low-code systems.
This service extracts the useful parts (seed names, gear names, etc.) and exposes them in a flat, predictable format.

This ensures:

Always-updated seed and gear lists
No stale mirror data
No authentication required
One stable endpoint for MacroDroid to poll every 5 minutes


-------------------------------------------------------------------------
🔗 Live Data Source
The flattener pulls directly from the official public Vulcan backend:

https://api.joshlei.com/json

This endpoint contains:
Live seed stock
Live gear stock
Egg stock
Event shop stock
Traveling merchant stock
Quantities, names, icons, and timers
It requires no API key.


-------------------------------------------------------------------------
🗂 Flattened Output Format
The server reduces the complex JSON into:

{
  "seeds": ["Carrot", "Tomato", "Blueberry", "Strawberry"],
  "gear": ["Harvest Tool", "Trowel"],
  "eggs": ["Fire Egg", "Frost Egg"],
  "events": ["Safari Seed Pack", "Spirit Bloom"],
  "merchant": "Fall Traveling Merchant"
}


This format is:
Stable
Easy for MacroDroid to parse
Ideal for iterator loops
Exactly tailored for SignalWatch alerts


-------------------------------------------------------------------------
⚙️ How It Works
When a user visits /, the server:
Fetches the full JSON from https://api.joshlei.com/json

Reads:
seed_stock
gear_stock
egg_stock
eventshop_stock
travelingmerchant_stock
Extracts only the display_name fields

Outputs them as simple arrays
No authentication
No caching
Always fresh
Perfect for 5-minute polling intervals


-------------------------------------------------------------------------
📁 server.js (core logic)

----
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
----

-------------------------------------------------------------------------
📦 package.json
{
  "name": "signalwatch-flattener",
  "version": "1.0.0",
  "description": "Flattens GAG API data for MacroDroid",
  "main": "server.js",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "node-fetch": "^3.3.2"
  },
  "scripts": {
    "start": "node server.js"
  }
}


-------------------------------------------------------------------------
🌍 Deploying to Render

Create a new Web Service
Connect it to this GitHub repo
Auto-deploy on commit
That’s it — Render will host your flattener and expose a clean JSON endpoint.

Example production URL:
https://signalwatch-flatten.onrender.com/

MacroDroid hits this URL every 5 minutes to check for new seeds.


-------------------------------------------------------------------------
🔔 MacroDroid Usage

The flattened endpoint makes this workflow trivial:

HTTP GET → your Render URL

Store JSON in a dictionary

Iterate seeds with {iterator_value}

Compare against your “wanted seeds” array

Trigger notifications when a match appears

Because the flattener strips away all complexity, MacroDroid never interacts with the raw GAG API.


-------------------------------------------------------------------------
🛟 Troubleshooting

Seeing stale data?
→ Ensure Render rebuilt the latest commit
→ Hit the endpoint manually to wake the instance

Empty arrays?
→ The GAG API occasionally returns empty lists during restock windows.
→ Your MacroDroid retry logic handles this.

Service not responding?
→ Render free tier sleeps after ~15 minutes of inactivity
→ First request may take 1–3 seconds
→ Subsequent requests are immediate


-------------------------------------------------------------------------
❤️ Credits

Grow-A-Garden – for the game and API
JoshLei – for the public Vulcan JSON endpoint
Raptaur / Chris – for the SignalWatch automation system
Tifa AI Companion – for systems design, flatten logic & debugging

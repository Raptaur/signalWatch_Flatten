
------------------------------------------------------------------------

------------------------------------------------------------------------
📘 SignalWatch Flattener

A lightweight JSON flattener for Grow-A-Garden stock data
Author: Raptaur (Chris)

------------------------------------------------------------------------
🌱 Overview

SignalWatch Flattener is a minimal Node.js service designed to fetch the live Grow-A-Garden stock data and convert it into a simplified JSON format that automation tools like MacroDroid can easily consume.

The official API returns deeply nested structures.
This service extracts the useful pieces — seed names, gear names, etc. — and provides a clean, predictable output.

This keeps the SignalWatch system:
Fast
Reliable
Easy to automate
Independent from Discord bots or stale mirrors


------------------------------------------------------------------------
🔗 Live Data Source

The service queries the official public Grow-A-Garden JSON endpoint:

https://api.joshlei.com/json

This endpoint contains:
Seed stock
Gear stock
Egg stock
Event shop
Traveling merchant
Quantities, icons, timers
Requires no authentication.


------------------------------------------------------------------------
🗂 Flattened Output Schema

The server exposes a simplified JSON structure:

{
  "seeds": [...],
  "gear": [...],
  "eggs": [...],
  "events": [...],
  "merchant": "..."
}


All arrays contain only human-readable item names (display_name), ideal for MacroDroid’s:
iterator loops
list comparisons
notifications
“track item” logic


------------------------------------------------------------------------
⚙️ How It Works

When someone requests the root endpoint (/):
The service fetches the full JSON from https://api.joshlei.com/json
It extracts the display_name field from each stock category
It returns a lightweight object containing only the relevant values

No caching.
No keys.
Always fresh.


------------------------------------------------------------------------
📁 Source Files

server.js
Handles fetching, flattening, and delivering JSON output.

package.json
Defines dependencies (express, node-fetch) and the start script.


------------------------------------------------------------------------
🌍 Deploying to Render

Create a new Render Web Service
Connect this GitHub repository
Enable auto-deploy on commit
Render will host the flattened endpoint (example):

https://signalwatch-flatten.onrender.com/

MacroDroid polls this URL every 5 minutes.


------------------------------------------------------------------------
🔔 Using with MacroDroid

This flattener enables:
Clean JSON GET requests
Array iteration
Seed-tracking logic
“Watchdog” alerts
Fail-safe retry logic
Reliable, predictable automation

MacroDroid no longer interacts with the full GAG API — only the flattened one.


------------------------------------------------------------------------
🛟 Troubleshooting

Seeing stale data?
→ Ensure Render deployed the latest commit.
→ Hit the Render URL once to wake the instance.

Empty arrays?
→ GAG API sometimes clears stock briefly during restock moments.

Slow first load?
→ Render free tier sleeps after 15 minutes of inactivity.


------------------------------------------------------------------------
💛 Credits

Grow-A-Garden — for the game & data
JoshLei — for the public JSON endpoint
Raptaur / Chris — creator of SignalWatch
Tifa AI Companion — debugging, design & flatten logic

import express from "express";
import fetch from "node-fetch";

const app = express();

async function fetchList(url) {
  const r = await fetch(url);
  if (!r.ok) return [];
  const arr = await r.json();
  return arr.map(x => x.name);  // DawnBot uses "name"
}

app.get("/", async (req, res) => {
  try {
    const seeds   = await fetchList("https://gagapi.onrender.com/seeds");
    const gear    = await fetchList("https://gagapi.onrender.com/gear");
    const eggs    = await fetchList("https://gagapi.onrender.com/eggs");
    const events  = await fetchList("https://gagapi.onrender.com/events");

    // DawnBot currently has no travelling merchant
    const merchant = null;

    res.json({ seeds, gear, eggs, events, merchant });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});

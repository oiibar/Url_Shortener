import express, { json } from "express";
import { generate } from "shortid";
import { isUri } from "valid-url";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: ["https://url-shortener-g03r.onrender.com"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
const PORT = 5000;
const urlDatabase = [];

app.use(json());

app.post("/api/shorten", (req, res) => {
  const { originalUrl } = req.body;

  // Validate the URL
  if (!isUri(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // Check if the URL is already in the database
  const existingUrl = urlDatabase.find(
    (url) => url.originalUrl === originalUrl
  );

  if (existingUrl) {
    return res.json(existingUrl);
  }

  // Create a new short URL
  const shortUrl = generate();
  const newUrl = {
    originalUrl,
    shortUrl,
  };

  urlDatabase.push(newUrl);
  res.json(newUrl);
});

app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;

  // Find the URL in the database
  const url = urlDatabase.find((url) => url.shortUrl === shortUrl);

  if (url) {
    return res.redirect(url.originalUrl);
  } else {
    return res.status(404).json({ error: "URL not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

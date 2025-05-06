import express from "express";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import ScreenshotModel from "./models/ScreenShots.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const sequelize = new Sequelize("your_db", "username", "password", {
  host: "localhost",
  dialect: "mysql",
});

const Screenshot = ScreenshotModel(sequelize, Sequelize.DataTypes);

sequelize.sync().then(() => {
  console.log("Database synced successfully.");
}).catch((err) => {
  console.error("Error syncing database:", err);
});

app.use(express.json());
app.use(express.static("public"));

app.post("/screenshot", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith("http")) {
    return res.json({ success: false, message: "Invalid URL" });
  }

  const filename = `screenshot_${Date.now()}.png`;
  const filepath = path.join(__dirname, "public", filename);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.screenshot({ path: filepath, fullPage: true });
    await browser.close();

    await Screenshot.create({ filename, url });

    res.json({ success: true, imageUrl: `/${filename}` });
  } catch (error) {
    console.error("Screenshot error:", error);
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

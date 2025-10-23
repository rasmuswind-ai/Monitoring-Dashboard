// index.js
import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

// Global pause state
let rdpPausedUntil = null;
let containerPausedUntil = null;
let sqlPausedUntil = null;

// Endpoint to check RDP count and respect pause state
app.get("/check-rdp-sessions", (req, res) => {
  const now = new Date();

  if (rdpPausedUntil && now < rdpPausedUntil) {
    // If paused, respond "OK" regardless
    return res.status(200).send(`OK - Paused until: ${rdpPausedUntil}`);
  }

  const filePath = "C:\\inetpub\\wwwroot\\rdp_data.txt";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read rdp_data.txt:", err);
      return res.status(500).send("Server Error");
    }

    const lines = data.trim().split("\n");
    const lastLine = Number(lines[lines.length - 1]);
    const hasAbnormal = lastLine > 150000;

    if (hasAbnormal) {
      console.error("ERROR: Abnormal RDP count detected");
      res.status(200).send("ERROR: Abnormal RDP count detected");
    } else {
      res.status(200).send("OK");
    }
  });
});

// Endpoint to pause/unpause RDP alert globally
app.post("/pause-rdp", (req, res) => {
  const { pauseHours } = req.body;

  if (pauseHours && typeof pauseHours === "number" && pauseHours > 0) {
    const pauseUntil = new Date();
    pauseUntil.setHours(pauseUntil.getHours() + pauseHours);
    rdpPausedUntil = pauseUntil;
    console.log(`RDP alert paused until ${rdpPausedUntil.toISOString()}`);
    res.status(200).send(`Paused RDP alert for ${pauseHours} hours.`);
  } else {
    // Clear pause
    rdpPausedUntil = null;
    console.log("RDP alert pause cleared");
    res.status(200).send("Cleared RDP alert pause.");
  }
});

// Endpoint to check IIS Docker Container count
app.get("/check-containers", (req, res) => {
  const now = new Date();
  const filePath = "C:\\inetpub\\wwwroot\\container_alert.txt";
  const warningLine =
    "The following IIS Docker Hosts has more containers running than the recommended amount of 100!";

  if (containerPausedUntil && now < containerPausedUntil) {
    // If paused, respond "OK" regardless
    console.log(
      `Container alert paused until ${containerPausedUntil.toISOString()}`
    );
    return res.status(200).send(`OK - Paused until: ${containerPausedUntil}`);
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read container_alert.txt:", err);
      return res.status(500).send("Server Error");
    }

    if (data.includes(warningLine)) {
      console.error("ERROR: Container count exceeds allowed maximum");
      return res
        .status(200)
        .send("ERROR: Container count exceeds allowed maximum");
    }

    // Default to OK if the warning line isn't found
    return res.status(200).send("OK");
  });
});

// Endpoint to reset container alert file
app.post("/reset-container-alert", (req, res) => {
  const { pauseHours } = req.body;
  const filePath = "C:\\inetpub\\wwwroot\\container_alert.txt";

  if (pauseHours && typeof pauseHours === "number" && pauseHours > 0) {
    const pauseUntil = new Date();
    pauseUntil.setHours(pauseUntil.getHours() + pauseHours);
    containerPausedUntil = pauseUntil;
    console.log(
      `Container alert paused until ${containerPausedUntil.toISOString()}`
    );

    fs.writeFile(filePath, "", "utf8", (err) => {
      if (err) {
        console.error("Failed to reset container_alert.txt:", err);
        return res.status(500).send("Server Error");
      }

      console.log("container_alert.txt has been reset");
      res.status(200).send("Container alert file has been reset");
    });
  } else {
    // Clear pause
    containerPausedUntil = null;
    console.log("Container alert pause cleared");
    res.status(200).send("Cleared container alert pause.");
  }
});

// Endpoint to check SQL Injections count
app.get("/check-sql-injections", (req, res) => {
  const now = new Date();

  if (sqlPausedUntil && now < sqlPausedUntil) {
    // if paused, respond "OK" regardless
    return res.status(200).send(`OK - Paused until: ${sqlPausedUntil}`);
  }

  const filePath = "C:\\inetpub\\wwwroot\\sql_injections.txt";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read sql_injections.txt: ", err);
      return res.status(500).send("Server Error");
    }

    const lines = data.trim().split("\n");
    const lastLine = Number(lines[lines.length - 1]);
    const hasAbnormal = lastLine > 500;

    if (hasAbnormal) {
      console.error("ERROR: SQL Injection detected");
      res.status(200).send("ERROR: SQL Injection detected");
    } else {
      res.status(200).send("OK");
    }
  });
});

// Endpoint to pause/unpause SQL Injection alert globally
app.post("/pause-sql-injections", (req, res) => {
  const { pauseHours } = req.body;

  if (pauseHours && typeof pauseHours === "number" && pauseHours > 0) {
    const pauseUntil = new Date();
    pauseUntil.setHours(pauseUntil.getHours() + pauseHours);
    sqlPausedUntil = pauseUntil;
    console.log(
      `SQL Injection Alert paused until ${sqlPausedUntil.toISOString()}`
    );
    res.status(200).send(`Paused SQL Injection alert for ${pauseHours} hours.`);
  } else {
    // Clear pause
    sqlPausedUntil = null;
    console.log("SQL Injection alert pause cleared");
    res.status(200).send("Cleared SQL Injection alert pause.");
  }
});

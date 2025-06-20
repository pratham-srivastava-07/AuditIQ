

import express from "express";
import { client } from "./client";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const auditLogPath = path.join(__dirname, "audit.log");

const history: any[] = [];

app.post("/transfer", (req:any, res: any) => {
  const { userId, from, to, amount, balances } = req.body;


  if (userId !== from) {
    return res.status(401).send("Unauthorized: userId must match sender.");
  }

  if (typeof from !== "string" || typeof to !== "string" || typeof amount !== "number" || typeof balances !== "object") {
    return res.status(400).send("Invalid input format.");
  }

  if (!(from in balances)) {
    return res.status(400).send(`Sender '${from}' not found.`);
  }

  if (!(to in balances)) {
    return res.status(400).send(`Receiver '${to}' not found.`);
  }

  if (balances[from] < amount) {
    return res.status(400).send("Insufficient balance.");
  }

  const oldState = JSON.stringify(balances);

  
  balances[from] -= amount;
  balances[to] += amount;

  const newState = JSON.stringify(balances);
  const summaryText = `${from} transferred $${amount} to ${to}`;
  const timestamp = new Date().toISOString();


  client.summarize({ content: summaryText }, (err1: any, summaryRes: any) => {
    if (err1) return res.status(500).send("Summarize error: " + err1.message);

    client.diff({ old_content: oldState, new_content: newState }, (err2: any, diffRes: any) => {
      if (err2) return res.status(500).send("Diff error: " + err2.message);

      const entry = {
        timestamp,
        summary: summaryRes.result,
        diff: diffRes.result,
        balances: { ...balances }
      };

      fs.appendFileSync(
        auditLogPath,
        `[${timestamp}]\nSummary: ${summaryRes.result}\nDiff:\n${diffRes.result}\n\n`
      );

      history.push(entry);

      res.send({
        message: "Transfer successful.",
        ...entry
      });
    });
  });
});


app.get("/history", (req, res) => {
  res.send(history);
});

app.get("/audit-log", (req, res) => {
  try {
    const log = fs.readFileSync(auditLogPath, "utf-8");
    res.type("text/plain").send(log);
  } catch (err) {
    res.status(500).send("Failed to read audit log.");
  }
});


app.post("/summarize", (req, res) => {
  client.summarize({ content: req.body.content }, (err: any, response: any) => {
    if (err) return res.status(500).send(err.message);
    res.send(response);
  });
});


app.post("/diff", (req, res) => {
  client.diff(req.body, (err: any, response: any) => {
    if (err) return res.status(500).send(err.message);
    res.send(response);
  });
});

app.listen(3000, () => {
  console.log("be1 API running on http://localhost:3000");
});

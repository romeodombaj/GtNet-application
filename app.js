const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const db = require("./db.json");

app.listen(3000);

app.get("/users", async (req, res) => {
  fs.readFile("./db.json", "utf8", async (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.post("/users/new", (req, res) => {
  res.sendStatus(200).send("NEW USER/S");
});

app.put("/users/:id", (req, res) => {
  res.sendStatus(200).send("EDIT USER");
});

app.delete("/users/:id", (req, res) => {
  res.sendStatus(200).send("DELETE USER");
});

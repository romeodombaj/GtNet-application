const express = require("express");
const router = express.Router();
const fs = require("fs");
const db = "./db.json";

// get all user data
router.get("/", async (req, res) => {
  fs.readFile(db, "utf8", async (error, data) => {
    if (error) {
      console.log(error);
      res.status(500);
      return;
    }
    res.status(200).json(JSON.parse(data));
  });
});

// add new user/s
router.post("/new", (req, res) => {
  res.sendStatus(200).send("NEW USER/S");
});

// edit user
router.put("/:id", (req, res) => {
  res.sendStatus(200).send("EDIT USER");
});

// delete user
router.delete("/:id", (req, res) => {
  res.sendStatus(200).send("DELETE USER");
});

module.exports = router;

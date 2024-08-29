const express = require("express");
const router = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
const db = "./db.json";

const jsonParser = bodyParser.json();

// read data from db
function readDB() {
  const data = fs.readFileSync(db, "utf8");
  return JSON.parse(data);
}

// write data to db
function writeDB(data) {
  fs.writeFile(db, JSON.stringify(data, null, 2), "utf8");
}

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
router.post("/new", jsonParser, (req, res) => {
  console.log("POST");
  const user = req.body.values;
});

// edit user
router.put("/:id", jsonParser, (req, res) => {
  console.log("PUT");
  const id = req.body.key;
  const user = req.body.values;

  console.log(id);
  console.log(user);
});

// delete user
router.delete("/:id", (req, res) => {
  console.log("DELETE");
  console.log(req.body);

  let users = readDB();
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  writeDB(users);
  res.status(200).send();
});

module.exports = router;

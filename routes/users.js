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
  fs.writeFileSync(db, JSON.stringify(data, null, 2), "utf8");
}

// get all user data
router.get("/", async (req, res) => {
  console.log("GETTING USER DATA");
  const users = readDB();
  res.status(200).json(users);
});

// add new user
router.post("/new", jsonParser, (req, res) => {
  console.log("ADDING A NEW USER");

  console.log(req.body);
  const users = readDB();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...req.body.values,
  };
  users.push(newUser);
  writeDB(users);
  res.status(201).json(newUser);
});

// edit user
router.put("/:id", jsonParser, (req, res) => {
  const users = readDB();
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body.values };
    writeDB(users);
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// delete user
router.delete("/:id", (req, res) => {
  console.log("DELETING USER");
  console.log(req.body);

  let users = readDB();
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  writeDB(users);
  res.status(200).send();
});

module.exports = router;

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { defaultUser, readDB, writeDB } = require("../db");
const { validateUser, checkOIB } = require("../dataValidation");

// get all user data
router.get("/", async (req, res) => {
  console.log("GETTING USER DATA");

  try {
    const users = await readDB();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add new user
router.post("/new", [jsonParser, validateUser], async (req, res) => {
  console.log("ADDING A NEW USER");

  try {
    const users = await readDB();
    const newUser = {
      ...defaultUser,
      id: users.length ? users[users.length - 1].id + 1 : 1,
      ...req.body.values,
    };

    await checkOIB(users, newUser, res);

    users.push(newUser);
    await writeDB(users);
    res.status(200).json(await newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// edit user
router.put("/:id", [jsonParser, validateUser], async (req, res) => {
  console.log("UPDATING USER DATA");

  try {
    const users = await readDB();

    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...req.body.values };
    await writeDB(users);
    res.status(200).json(await users[userIndex]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  console.log("DELETING USER");

  try {
    const users = await readDB();
    const userId = parseInt(req.params.id, 10);
    const updatedUsers = users.filter((user) => user.id !== userId);

    if (users.length === updatedUsers.length) {
      return res.status(404).json({ message: "User not found" });
    }

    await writeDB(updatedUsers);
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

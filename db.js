const db = "./db.json";
const fs = require("fs").promises;

module.exports = {
  defaultUser: {
    id: undefined,
    name: "",
    surname: "",
    phone: "",
    email: "",
    oib: "",
  },

  readDB: async () => {
    try {
      const data = await fs.readFile(db, "utf8");
      return JSON.parse(data);
    } catch (err) {
      throw new Error(err);
    }
  },

  writeDB: async (data) => {
    try {
      await fs.writeFile(db, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      throw new Error("Error writing to database");
    }
  },
};

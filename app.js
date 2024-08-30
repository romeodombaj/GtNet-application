const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use("/", express.static("_frontend"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const useRouter = require("./routes/users");

app.use("/users", useRouter);

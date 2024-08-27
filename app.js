const express = require("express");
const app = express();
const cors = require("cors");

app.listen(3000);

const useRouter = require("./routes/users");

app.use("/users", useRouter);

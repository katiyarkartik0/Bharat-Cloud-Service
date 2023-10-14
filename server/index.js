const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { authRoutes } = require("./routes/auth");
// const { taskRoutes } = require("./routes/task");
const { verifyToken } = require("./middleware/verifyToken");
const routes = express.Router();

dotenv.config();
const app = express();
app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

app.use("/api/auth", authRoutes);
// app.use("/api/tasks", verifyToken, taskRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("App has started");
    app.listen(process.env.PORT);
  });

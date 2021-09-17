const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const responseTime = require("response-time");

const { apiRouter } = require("./routes");
const { APP_PORT } = require("./constants");

const app = express();
const port = APP_PORT;
app.use(express.json());
app.use(responseTime());
app.use(cors());

sequelize
  .sync({ alter: true })

  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("error connect to db");
    console.log(error);
  });

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});

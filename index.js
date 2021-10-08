const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const responseTime = require("response-time");
const db = require("./models");
const { APP_PORT } = require("./constants/index");
const { apiRouter } = require("./routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(responseTime());
app.use(express.json());

app.use("/api", apiRouter);

db.sequelize.sync({ alter : true }).then(() => {
  app.listen(APP_PORT, () =>
    console.log(
      `⚡️ [server]: Server is running at http://localhost:${APP_PORT}`
    )
  );
});

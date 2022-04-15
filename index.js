const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const responseTime = require("response-time");
const db = require("./models");
const { APP_PORT } = require("./constants/index");
const { apiRouter } = require("./routes");
const fileUpload = require("express-fileupload");
const scheduler = require("./schedulers/index")
const cronConfig = require("./config/cronConfig")

const app = express();

app.use(cors());
app.use(helmet());
app.use(responseTime());
app.use(express.json());
app.use("/api", apiRouter);

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on('connection', (socket) => {
  console.log("connected");
  socket.emit("welcome", "hello")
})

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connect to db");
    console.log(error);
  });

server.listen(APP_PORT, () => {
  console.log(
    `⚡️ [server]: Server is running at http://localhost:${APP_PORT}`
  );
});

// scheduler.initCron(cronConfig)
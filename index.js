const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const responseTime = require("response-time");
const dbConnection = require('./db/index')
const { APP_PORT } = require('./constants/index')
const { apiRouter } = require('./router')

const app = express();

app.use(cors());
app.use(helmet());
app.use(responseTime());
app.use(express.json());

dbConnection
        .then(() => {
            console.log("Connected to DB")
        })
        .catch((err) => {
            console.log(err);
        });

app.use("/api" , apiRouter)


app.listen(APP_PORT , () => {
    console.log(
        `⚡️ [server]: Server is running at http://localhost:${APP_PORT}`
    )
})
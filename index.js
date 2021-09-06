const express = require('express');
const dbConnection = require('./db/dbConn')
const app = express();
const { APP_PORT } = require('./constants/index')
const {apiRouter} = require('./router')
app.use(express.json)

dbConnection
        .then(() => {
            console.log("Connected to DB")
        })
        .catch((err) => {
            console.log(err);
        });

app.use("/api" , apiRouter)


app.listen(APP_PORT , () =>{
    console.log(`server running at port ${APP_PORT}`)
})
const port = 3000;

const express = require('express');
const app = express();
const isConnectDB = require('./db/dbConnection')
const { APP_PORT } = require('./constant/index')

const {apiRouter} = require('./router/index')
app.use(express.json)

isConnectDB
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
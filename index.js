const express = require('express')
const app = express();
const port = 3000;

const {apiRouter} = require('./router')
app.use(express.json)


app.use("/api" , apiRouter)


app.listen(port , () =>{
    console.log(`server running at port ${port}`)
})
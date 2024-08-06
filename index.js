const express = require('express')
require("dotenv").config();
const clc = require('cli-color')
const session = require("express-session")
const mongoDbSession = require('connect-mongodb-session')(session)

//file imports
const db = require('./db');
const authRouter = require('./routers/authRoute');
const blogRouter = require('./routers/blogRouter');
const { isAuth } = require('./middlewares/authMiddleware');
const followRouter = require('./routers/followRouter');
const cleanUpBin = require('./cron');

const app = express();
const PORT = process.env.PORT 

// session setup
const store = new mongoDbSession({
    uri: process.env.MONGO_URI,
    collection:'sessions'
})

//middleware
//auth/login
//blog/create-blog
app.use(express.json())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use('/auth' ,authRouter)
app.use('/blog', isAuth, blogRouter)
app.use('/follow',isAuth, followRouter)

app.listen(8000,()=>{
    console.log(clc.blueBright(`server is running on PORT: ${PORT}`));
    cleanUpBin()
})


// server.js >>> router >>> controller >>>>models(DB calls) >>> schemas
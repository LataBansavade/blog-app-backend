    const mongoose = require('mongoose')
    const clc = require('cli-color')
   
    mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log(clc.bgGreen("mongodb connected successfully"));
    }).catch((err)=>{
        console.log(clc.redBright(err));
    })
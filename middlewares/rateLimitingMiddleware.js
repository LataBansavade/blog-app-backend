const accessSchema = require("../schemas/accessSchema");

const rateLimiting = async(req , res , next)=>{
   console.log("rate Limiting");
   const sid = req.session.id
    try {
            const accessDb =  await accessSchema.findOne({sessionId: sid})

            if(!accessDb){
                const accessObj = new accessSchema({
                    sessionId : sid,
                    time : Date.now()
                })
                 await accessObj.save()
            }

            const diff = (Date.now() - accessDb.time.getTime()) / 1000

            if(diff < 1){
                return res.send({
                    status : 429,
                    message : "Too many requests, Please wait for some time"
                })
            }

            await accessSchema.findOneAndUpdate(
                {sessionId : sid},
                {time : Date.now()}
            )

            next()

    } catch (error) {
        return res .send({
            status: 500,
            message: "Database Error",
            error: error
 
        })
    }
   
  
}
module.exports = rateLimiting;
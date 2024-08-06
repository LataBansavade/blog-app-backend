const { LIMIT } = require('../privateConstants')
const followSchema = require('../schemas/followSchema')
const userSchema = require('../schemas/userSchema')

const followUser =({followerUserId , followingUserId})=>{

    return new Promise(async(resolve,reject)=>{
        try {
           const followExits = await followSchema.findOne({
            $and : [{followerUserId},{followingUserId}]
           })

           if(followExits){
            return reject("You are already following this user")
           }
            const followObj = new followSchema({
                followerUserId,
                followingUserId,
                creationDateTime : Date.now()
            })

            const followDb =  await followObj.save()
            resolve(followDb)
            
        } catch (error) {
            reject(error)
        }
    })
}

const getFollowinglist= ({followerUserId , SKIP})=>{
    return new Promise(async(resolve,reject)=>{

        try {

            //const followingUserDb =  await followSchema.find({followerUserId})
            //.populate("followingUserId")
            // .sort({ creationDateTime : -1})
            //.skip(SKIP)
            //.limit(LIMIT)
            // console.log(followingUserDb)

            const followingList = await followSchema.aggregate([
               {
                    $match : {followerUserId: followerUserId}
               } ,
               {
                    $sort :{ creationDateTime : -1}
               },
               {
                    $skip : SKIP
               },
               {
                    $limit : LIMIT
               }
             ])
                const followingUserIds =   followingList.map((user) => user.followingUserId);

                const userDetails  = await userSchema.find({_id :{$in : followingUserIds}})

             resolve(userDetails.reverse())

        } catch (error) {
                reject(error)
        }
    })

}

const getfollowerList = ({followingUserId ,SKIP}) =>{
        return new Promise(async(resolve , reject)=>{
            try {
                    const followerList = await followSchema.aggregate([
                        {
                            $match : {followingUserId : followingUserId}
                        },
                        {
                            $sort : {creationDateTime : -1}
                        },
                        {
                            $skip : SKIP
                        },
                        {       
                            $limit : LIMIT
                        }
                    ])

                    const followerUserIdsList = followerList.map((follow)=>follow.followerUserId) 
                    const followerUserDataDb = await userSchema.find({_id : followerUserIdsList})

                    resolve(followerUserDataDb .reverse())
            } catch (error) {
                    reject (error)
            }
        })
}

const unfollowUser = ({followingUserId, followerUserId})=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const unfollowDb = await followSchema.findOneAndDelete({
                $and : [{followerUserId},{followingUserId}]
            })
            resolve(unfollowDb)
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {followUser,getFollowinglist,getfollowerList,unfollowUser}
const followUser = require("../models/followModel");
const User = require("../models/userModel");


const followUserController = async(req,res)=>{

    // userA(follwerUserId) ----> userB(followingUserId)
    const followerUserId = req.session.user.userId;
    const followingUserId = req.body.followingUserId;
    console.log("ids>>>>",followerUserId ,followingUserId);

    try {
        await User.findUserwithKey({key :followerUserId})
    } catch (error) {
        return res.send({
            status: 400,
            message: "follwer userId not found",
            
        })
    }

   
    try {
        await User.findUserwithKey({key :followingUserId})
    } catch (error) {
        
        return res.send({
            status: 400,
            message: "following UserId not found",
            error: error
        })
    }
 ///////////////////////////////////////////////////////////////////////////////

    try {
        const followDb = await followUser({followerUserId,followingUserId})
        console.log(followDb);
        return res.send({
            status: 201,
            message: "follow successfull",
            data: followDb
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error",
            error: error
        })
    }

    return res.send("follow is working from controller")

}

const getFollowinglistController = async(req,res)=>{
    const followerUserId = req.session.user.userId;
    const SKIP = Number(req.query.skip)|| 0;

    try {
         const followDb = await followUser.getFollowinglist({followerUserId,SKIP})
         console.log(followDb);
         return res.send({
             status: 200,
             message: "Read Successfull",
             data: followDb
         })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error",
            error: error
        })
    }

}

const getFollowerlistController = async(req,res)=>{

    const followingUserId = req.session.user.userId;
    const SKIP = Number(req.query.skip) ||0;

    try {
        const followingUserDb = await followUser.getfollowerList({followingUserId , SKIP})

        return res.send({
            status: 200,
            message: "Read Successfull",
            data: followingUserDb
        })
    } catch (error) {
        res.send({
            status: 500,
            message: "Internal Server Error",
            error: error
        })
    }

}

const unFollowUserController = async (req,res)=>{
    
    const followerUserId = req.session.user.userId;
    const followingUserId = req.body.followingUserId;

    if(!followerUserId  || !followingUserId){
        return res.send({
            status: 400,
            message: "Ids are missing"
        })
    }

    try {
            const followDb = await followUser.unfollowUser({followerUserId,followingUserId})
            return res.send({
                ststus : 200,
                message: "Unfollow Successfull",
                data: followDb
            })
    } catch (error) {
         return res.send({
             status: 500,
             message: "Internal Server Error",
             error: error
         })
    }
}
module.exports = { followUserController,getFollowinglistController, getFollowerlistController,unFollowUserController}
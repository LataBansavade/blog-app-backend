const { createBlog, getAllBlogs, getMyBlogs, getBlogWithId, updateBlog, deleteBlog } = require("../models/blogModel");
const { getFollowinglist } = require("../models/followModel");
const User = require("../models/userModel");
const { blogDataValidate } = require("../utils/blogUtils");

const createBlogController = async (req,res)=>{
    console.log(req.session);

    const{title,textBody} = req.body;
    
    const userId = req.session.user.userId;

    try {
          await blogDataValidate({title,textBody})
           const userDb = await User.findUserwithKey({key : userId})
           console.log("userDb in Blog create is>>>>",userDb);


    } catch (error) {
        console.log(error);
        return res.send({
            status: 400,
            message: "Blog Data error",
            error : error
        })
    }

    try {
        const blogDb = await createBlog({title,textBody,userId})
         return res.send({
            status: 201,
            message: "Blog Created Successfully",
            data: blogDb
         });
    } catch (error) {
        return res.send({
            status: 500,
            message: " DataBase error",
            error : error
        })
    }
   
    

    
}

// sorted and paginated
const readAllBlogController = async(req, res) =>{
    const SKIP = parseInt(req.query.skip) || 0;
    const followerUserId = req.session.user.userId

    try {

        const followerList = await  getFollowinglist({followerUserId,SKIP})
        const followingUserIdsList = followerList.map((obj) => obj._id)

       const blogDb  = await getAllBlogs({followingUserIdsList,SKIP})

       if(blogDb.length === 0){
        return res.send({
            status: 203,
            message: "No Blogs Found",
           
         });
       }
       return res.send({
            status: 200,
            message: "All Blogs",
            data: blogDb
         });
    } catch (error) {
        return res.send({
            status: 500,
            message: " DataBase error",
            error : error
        })
    }
  


}

const readMyBlogController = async(req, res) =>{

        const SKIP = parseInt(req.query.skip) || 0;
        const userId = req.session.user.userId ;

        try {
            const myBlogDb = await getMyBlogs({SKIP ,userId});

            if(myBlogDb.length ===0){
                return res.send({
                    status: 203,
                    message: "No Blogs Found",
                 });
                }

            return res.send({
                status: 200,
                message: "Read my  Blogs Success",
                data: myBlogDb
             });
          
            }
        catch (error) {
            return res.send({
                status: 500,
                message: " DataBase error",
                error : error
            })
        }

}

const editBlogController = async(req,res)=>{
        console.log(req.body);
        //title ,textBody ,blogId
        const {title, textBody} = req.body.data;
        const blogId = req.body.blogId;
        const userId = req.session.user.userId;

        try {
          await  blogDataValidate({title, textBody})
        } 
        catch (error) {
            return res.send({
                status: 400,
                message: "Blog Data error",
                error : error
            })
        }

        // find the Blog
        // ownwership Check
        // 30 min time constarints

        try {
             const blogDb = await getBlogWithId({blogId})
             console.log(blogDb);
            
             //id1.equals(id2)
             //id1.toString() === id2.toString()
             console.log("ckeck",userId.equals(blogDb.userId));
             if(!userId.equals(blogDb.userId))
                {
                    return res.send({
                        status: 403,
                        message: "You are not the owner of this blog",
                    })
                }

                console.log((Date.now()-blogDb.creationDateTime)/(1000*60));

                const diff = (Date.now()-blogDb.creationDateTime)/(1000*60);
                if(diff >30)
                    {
                        return res.send({
                            status: 400,
                            message: "Not allowed to Edit the Blog after 30 mins of creation",
                        })
                    }

                       const prevBlogDb = await updateBlog({title,textBody,blogId})
                       return res.send(
                        {
                            status: 200,
                            message: "Blog Edited Successfully",
                            data: prevBlogDb
                        })
                       
            } catch (error) {
                return res.send({
                    status: 500,
                    message: "DataBase error",
                    error : error
                })
            }

}

const deleteBlogController = async(req,res) =>{

    const userId = req.session.user.userId;
    const blogId = req.body.blogId;

    // find the blog

    try {
         const blogDb = await getBlogWithId({blogId})
        // ownership check
        if(!userId .equals(blogDb.userId)){
            return res.send({
                status: 403,
                message: "You are not allowed to delete this blog",
            })
        }
         //delete 

         const deletedBlogDb = await deleteBlog({blogId})
         return res.send({
            status: 200,
            message: "Blog Deleted Successfully",
            data: deletedBlogDb
         })

    } catch (error) {
        return res.send({
            status: 400,
            message: "Blog Data error",
            error : error
        })
    }

    
   
    return res.send("delete is working")
}
module.exports = {createBlogController,readAllBlogController,readMyBlogController,editBlogController,deleteBlogController}
const { LIMIT } = require("../privateConstants");
const blogSchema = require("../schemas/blogSchema")
const { ObjectId } = require('mongodb');


const createBlog=({title,textBody,userId})=>{
    return new Promise(async(resolve,reject)=>{
      const blogObj = new blogSchema({
        title, textBody,creationDateTime:Date.now(), userId
      })
      try {
             const blogDb = await blogObj.save();
             resolve(blogDb)

      } catch (error) {
        reject(error)
      }
    })
}

const getAllBlogs = ({followingUserIdsList,SKIP})=>{
  return new Promise(async(resolve,reject)=>{
    // pagination and sort operation
    try {
      const blogDb = await blogSchema.aggregate([
        {
          $match :{userId : {$in : followingUserIdsList},
          isDeleted : { $ne : true}},
        },
        {
          $sort :{creationDateTime:-1}          // -1 for desending +1 for asending
        },
        {
          $skip : SKIP
        },
        {
          $limit : LIMIT,
        }
        
      ])
      resolve(blogDb)
    } catch (error) {
      reject(error)
    }
  })
}

// $eq : {isDeleted : false}
// $ne : {isDeleted : true}

const getMyBlogs = ({SKIP,userId})=>{
    return new Promise(async(resolve,reject)=>{
      // pagination and sort , Match
      try {
        const myBlogsDb = await blogSchema.aggregate([
          {
            $match :{userId:userId , isDeleted : { $ne : true}}  //is Deleted :true not include the data  
          },
          {
            $sort :{creationDateTime:-1}          // -1 for desending +1 for asending
          },
          {
            $skip : SKIP
          },
          {
            $limit : LIMIT,
          },
          
          
        ])
        resolve(myBlogsDb)
      } catch (error) {
        reject(error)
      }
    })
}

const getBlogWithId = ({blogId})=>{
    return new Promise(async(resolve,reject)=>{
      try {

          if(!blogId) reject("Missing Blog Id")
          const blogDb =await blogSchema.findOne({_id:blogId});
          if(!blogDb) reject(`No blog found for this blogId: ${blogId}`)
        resolve(blogDb)
      } catch (error) {
        reject(error)
      }
    })
}

const updateBlog = ({title,textBody,blogId})=>{
  return new Promise(async(resolve, reject)=>{
    try {
      const prevData = await blogSchema.findOneAndUpdate({_id:blogId}, {title,textBody})
      resolve(prevData)
      
    } catch (error) {
      reject(error)
    }
  })
}


const deleteBlog=({blogId})=>{
  return new Promise(async(resolve, reject)=>{
    try {
      //const deleteBlogDb = await blogSchema.findOneAndDelete( {_id : blogId});
       
      const deleteBlogDb = await blogSchema.findOneAndUpdate(
        {_id : blogId},
        {isDeleted:true , deletionDateTime : Date.now()});

      resolve(deleteBlogDb)

    } catch (error) {
       reject(error)
    }
  })
}
module.exports = {createBlog,getAllBlogs,getMyBlogs,getBlogWithId,updateBlog,deleteBlog}
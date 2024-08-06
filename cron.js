const cron = require('node-cron');
const blogSchema = require('./schemas/blogSchema');

function cleanUpBin (){
    cron.schedule("* 0 * * *" , async ()=>{
        // console.log("cron is working");

        // find the blog  which has been deleted

        try {
              const deletedBlogs = await blogSchema.find({isDeleted: true})
              if(deletedBlogs.length>0){
                const deletedBlogsId = []
                deletedBlogs.map((blog)=> 
                {   
                    // console.log((Date.now()- blog.deletionDateTime.getTime())/(1000*60));
                    const diff  = (Date.now()- blog.deletionDateTime.getTime())/(1000*60*60*24)

                    if(diff > 30 ){
                        deletedBlogsId.push(blog._id);
                    }
                })
                if(deletedBlogsId.length>0){
                    try {
                        const deletedBlogs = await blogSchema.findOneAndDelete({
                            _id : {$in : deletedBlogsId},
                        })
                        // console.log(`blog has been deleted : ${deletedBlogs._id}`);
                    } catch (error) {
                        console.log(error);
                    }
                    
                }
                
            }
        } catch (error) {
        }

      
        // compare the deletion time
        //diff > 30 delete the blog from DB permenatlly
    })
}

module.exports = cleanUpBin
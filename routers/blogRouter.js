const express = require('express');
const { createBlogController, readAllBlogController, readMyBlogController, editBlogController, deleteBlogController } = require('../controllers/blogController');
const rateLimiting = require('../middlewares/rateLimitingMiddleware');

const blogRouter = express.Router();

blogRouter.post('/create-blog',rateLimiting,createBlogController);
blogRouter.get('/get-blogs',readAllBlogController);
blogRouter.get('/get-myblogs',readMyBlogController);
blogRouter.post('/edit-blog', editBlogController)
blogRouter.post('/delete-blog',deleteBlogController )

module.exports= blogRouter
const express = require('express');
const  followRouter = express.Router();
const {  followUserController, getFollowinglistController, getFollowerlistController, unFollowUserController } = require('../controllers/followController');
const rateLimiting = require('../middlewares/rateLimitingMiddleware');


followRouter.post('/follow-user',rateLimiting, followUserController);
followRouter.get('/following-list',getFollowinglistController);
followRouter.get('/follower-list', getFollowerlistController);
followRouter.post('/unfollow-user', unFollowUserController)

module.exports = followRouter   
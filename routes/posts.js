const express = require('express');
const router = express.Router();
const Category = require('../models/categories')
const formidableMiddleware = require('express-formidable');



const PostsCtrl = require('../controllers/posts');
const AuthCtrl = require('../controllers/auth');

router.post('/category/register', PostsCtrl.registerCategory);
router.get('/category', PostsCtrl.getCategories);
router.delete('/category/:id', PostsCtrl.deleteCategory);
router.post('/register', formidableMiddleware(), PostsCtrl.registerPost);
router.get('', PostsCtrl.getPosts);
router.delete('/:id', PostsCtrl.deletePost);
router.put('', formidableMiddleware(), PostsCtrl.updatePost);
router.get('/getPostById/:id', PostsCtrl.getPostById);
router.get('/get/:category', PostsCtrl.getPostsByCategories);
router.get('/count/:category', PostsCtrl.countAllPosts);
router.get('/getPostByIDForView/:id', PostsCtrl.getPostById);
router.post('/comments/:id', PostsCtrl.addComment);
router.get('/userComments/:id', PostsCtrl.getUserComments);
router.delete('/comment/:id', PostsCtrl.deleteComment);
router.get('/postcomments/:id', PostsCtrl.getPostComments);
router.get('/getPostCommentCount/:id', PostsCtrl.getPostCommentCount);


module.exports = router;
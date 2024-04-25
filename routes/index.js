var express = require('express');
var router = express.Router();

const admin = require('../controller/admin.controller');
const user = require('../controller/user.controller');
const blog = require('../controller/blog.controller');
const comment = require('../controller/comment.controller');
const category = require('../controller/category.controller');

router.get('/admin',admin.login);
router.get('/adminregister',admin.register);

router.get('/login',user.login);
router.post('/register',user.register);
router.get('/user',user.getuser);
router.post('/update/:id',user.update);
router.get('/delete/:id',user.delete);

router.post('/addblog',blog.addblog);
router.get('/blog',blog.getblog);
router.get('/deleteblog/:id',blog.delete);
router.post('/updateblog/:id',blog.update);
router.get('/like/:id',blog.likeblog);
router.post('/addcategory/:id',blog.addcategory);
router.post('/admin/addblog',blog.addadminblog);
router.get('/admin/viewblog',blog.getadminblog);
router.post('/adminblogupdate/:id',blog.adminblogupdate);
router.get('/adminblogdelete/:id',blog.adminblogdelete);
router.get('/admin/viewuserblog/:id',blog.getadminuserblog);
router.post('/admin/updatestatusblog/:id',blog.adminupdatestatusblog);
router.get('/admin/blog/statusblog',blog.getstatusbyblog);
router.get('/admin/blog/categoryblog',blog.getcategorybyblog);

router.post('/comment/:id',comment.addcommenttoblog);
router.get('/comment',comment.getcomment);

router.get('/category',category.getcategory);

module.exports = router;

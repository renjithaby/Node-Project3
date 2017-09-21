/**
 * Created by rabby on 11/09/2017.
 */
var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var app = req.app;
  res.send('respond with a resource');
});


/*let userData = {id: "1", username: "rr", password: "rr",
 addressList: [{id: "1", name: "friend1", currentAddress:"address1"},
 {id: "2", name: "friend2",currentAddress:"address2"}]};*/
/* POST to Add User Service */


/* POST to Add User Service */

router.post('/removeuser', function (req, res) {



    // Set our internal DB variable
    var db = req.db;
    //res.redirect("/userlist1");
    // Get our form values. These rely on the "name" attributes
    var id = req.body.userid;


    // Set our collection
    var collection = db.get('usercollection1');

    // Submit to the DB
    collection.remove({"_id": id}, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
           // res.redirect("userlist");
        }
    });
});




/* GET Userlist page. */
router.get('/userlist', function (req, res) {
    var db = req.db;

    var collection = db.get('usercollection1');
       collection.find({}, {}, function (e, docs) {
        /* res.render('userlist', {
         "userlist" : docs
         });*/
        if(e){
            res.send({result:"failed"});
        }
        res.send({"userlist": docs});
    });
});


router.post('/addfollowing', function (req, res) {
    var db = req.db;
    var userId = req.body.userid;
    var authorId = req.body.authorid;
    var collection = db.get('usercollection1');


    collection.update(
        {_id: userId},
        {$push: {following: {"authorId":authorId}}}, function (err, docs) {
             if(err) {
                res.send({result: "failed1", message: "There was a problem adding the information to the database."});
             }
        }).then(() => {
            collection.find({_id:userId}, function (err, docs) {

                if (err) {
                    // If it failed, return error
                    res.send({result:"failed",message:"There was a problem adding the information to the database."});
                }
                else {
                    // And forward to success page
                    res.json({result: "success", user : docs[0]})
                }
            });

    });
});


router.post('/removefollowing', function (req, res) {
    var db = req.db;
    var userId = req.body.userid;
    var authorId =  req.body.authorid;
    var collection = db.get('usercollection1');


    collection.update(
        {_id: userId},
        {$pull: {following: {"authorId":authorId}}}, function (err, docs) {
            if(err) {
                res.send({result: "failed1", message: "There was a problem adding the information to the database."});
            }
            //res.send({"user": docs});
        }).then(() => {
            collection.find({_id:userId}, function (err, docs) {

                if (err) {
                    // If it failed, return error
                    res.send({result:"failed1",message:"There was a problem adding the information to the database."});
                }
                else {
                    // And forward to success page

                    res.json({result: "success", user : docs[0]})
                }
            });

    });
});



router.post('/addlike', function (req, res) {
    var db = req.db;
    var userId = req.body.userid;
    var articleId = req.body.articleid;
    var time = Date.now();
    var resultData = {};
    var likeCollection = db.get('likecollection1');
    var articleCollection = db.get('articlecollection1');

    // Submit to the DB
    likeCollection.insert({
        "userid": userId,
        "articleid": articleId,
        "time":time
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            likeCollection.find({userid: userId}, {sort:{time:-1}}, function (err, docs) {

                if (err) {
                    // If it failed, return error
                    res.send({result: "failed", message: "There was a problem adding the information to the database."});
                }
                else {
                    resultData.userLikes = docs;
                    likeCollection.count({articleid: articleId}, function (err, count) {

                        if (err) {
                            // If it failed, return error
                            res.send({result: "failed", message: "There was a problem adding the information to the database."});
                        }
                        else {
                            articleCollection.update(
                                {_id: articleId},
                                {$set: { "likes" : count }}, function (err, docs) {
                                    if(err) {
                                        res.send({result: "failed1", message: "There was a problem adding the information to the database."});
                                    }
                                    //res.send({"user": docs});
                                }).then(() => {

                                    res.json({result: "success", resultData : resultData})

                                });

                        }
                    });
                }
            });
        }
    });
});



router.post('/removelike', function (req, res) {
    var db = req.db;
    var userId = req.body.userid;
    var articleId = req.body.articleid;
    var time = Date.now();
    var resultData = {};
    var likeCollection = db.get('likecollection1');
    var articleCollection = db.get('articlecollection1');

    // Submit to the DB
    likeCollection.remove({"userid": userId,"articleid":articleId}, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            likeCollection.find({userid: userId}, {sort:{time:-1}}, function (err, docs) {

                if (err) {
                    // If it failed, return error
                    res.send({result: "failed", message: "There was a problem adding the information to the database."});
                }
                else {
                    resultData.userLikes = docs;
                    likeCollection.count({articleid: articleId}, function (err, count) {

                        if (err) {
                            // If it failed, return error
                            res.send({result: "failed", message: "There was a problem adding the information to the database."});
                        }
                        else {
                            articleCollection.update(
                                {_id: articleId},
                                {$set: { "likes" : count }}, function (err, docs) {
                                    if(err) {
                                        res.send({result: "failed1", message: "There was a problem adding the information to the database."});
                                    }
                                    //res.send({"user": docs});
                                }).then(() => {

                                    res.json({result: "success", resultData : resultData})

                                });

                        }
                    });
                }
            });
        }
    });
});

router.post('/getuserlikes', function (req, res) {
    var db = req.db;
    var userId = req.body.userid;
    var collection = db.get('likecollection1');
    //userid: userId
    collection.find({"userid":userId}, {sort:{time:-1}}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result: "failed", message: "There was a problem adding the information to the database."});
        }
        else {
                res.send({result: "success", userLikes: docs});
        }
    });
});

router.post('/addcomment', function (req, res) {
    var db = req.db;
    var user = req.body.user;
    var articleId = req.body.articleid;
    var comment = req.body.comment;
    var time = Date.now();
    var collection = db.get('commentcollection1');


    // Submit to the DB
    collection.insert({
        "user": user,
        "articleid": articleId,
        "comment": comment,
        "time":time
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            collection.find({articleid: articleId}, {limit:5, sort:{time:-1}}, function (err, docs) {

                if (err) {
                    // If it failed, return error
                    res.send({result: "failed", message: "There was a problem adding the information to the database."});
                }
                else {
                    res.send({result: "success",comments: docs});
                }
            });
        }
    });
});

router.post('/removecomment', function (req, res) {
    var db = req.db;
    var commentId = req.body.commentid;
    var articleId = req.body.articleid;
    var collection = db.get('commentcollection1');


    collection.remove({"_id": commentId}, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            collection.find({articleid: articleId}, {limit:15, sort:{time:-1}}, function (err, docs) {

                if (err) {
                    // If it failed, return error
                    res.send({result: "failed", message: "There was a problem adding the information to the database."});
                }
                else {
                    res.send({result: "success", comments: docs});
                }
            });

        }
    });
});


router.post('/loadUserFromToken', function (req, res) {
    var db = req.db;

    var userId = req.decoded._id;
    var collection = db.get('usercollection1');


    collection.find({_id:userId}, {limit:5, sort:{time:-1}}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result: "failed", message: "There was a problem adding the information to the database."});
        }
        else {

            res.send({result: "success", user: docs[0]});
        }
    });
});



/*let userData = {id: "1", username: "rr", password: "rr",
 addressList: [{id: "1", name: "friend1", currentAddress:"address1"},
 {id: "2", name: "friend2",currentAddress:"address2"}]};*/
/* POST to Add User Service */
router.post('/addarticle', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes

    var newArticle = {

        title: req.body.title,
        content:req.body.content,
        likes: 0,
        authorId:req.body.author.authorId,
        author:req.body.author,
        time:Date.now(),
        comments:[]
    }

    // Set our collection
    var collection = db.get('articlecollection1');



    // Submit to the DB
    collection.insert({
        "title": newArticle.title,
        "content":newArticle .content,
        "likes": 0,
        "authorId":newArticle.author.authorId,
        "author":newArticle.author,
        "time":Date.now(),
        "comments":[]
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",messsage:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            res.json({result: "success", article : doc})
        }
    });
});



router.post('/removearticle', function (req, res) {

    // Set our internal DB variable
    var db = req.db;
    //res.redirect("/userlist1");
    // Get our form values. These rely on the "name" attributes
    var articleid = req.body.articleid;


    // Set our collection
    var collection = db.get('articlecollection1');

    // Submit to the DB
    collection.remove({_id: articleid}, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",messsage:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            res.json({result: "success"});
        }
    });
});



router.post('/getyourfeed', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var id = req.body.userid;
    var usercollection = db.get('usercollection1');
    // Set our collection
    var collection = db.get('articlecollection1');

    // Submit to the DB
    usercollection.find({_id:id},{}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            // Submit to the DB
            // send empty array if there is no following
            if(!docs[0].following.length>0){
                res.send({result:"success",article : []});
            }


        }
    }).then((docs) => {


        // docs[0].following = [{ "author": "59b698be8e920a53fafd7a52"},{"author": "59b6b36b238bf2558572f2f2"}];
        // {$or :docs[0].following}
        collection.find({$or :docs[0].following},{limit:4, sort:{time:-1}}, function (err, docs) {

            if (err) {
                // If it failed, return error
                res.send({result:"failed",message:"There was a problem adding the information to the database."});
            }
            else {
                // And forward to success page
                res.json({result: "success", article : docs})
            }
        });

    })


});








module.exports = router;

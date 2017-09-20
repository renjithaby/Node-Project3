var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var loginId = null;


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Helloo World'});
});


router.post('/adduser', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userPassword = req.body.password;
    var userEmail = req.body.email;

    // Set our collection
    var collection = db.get('usercollection1');

    // Submit to the DB
    collection.insert({
        "username": userName,
        "password": userPassword,
        "email": userEmail,
        "following":[]
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            res.send({result: "success"});
            //router.post('/authenticate'
        }
    });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
    //console.log("req.body.name");
    //console.log(req.body.name);
    var app = req.app;
    var db = req.db;

    var collection = db.get('usercollection1');
    // Submit to the DB
    collection.find({
        "username": req.body.username
    }, function(err, user) {

        if (err) throw err;

        if (!user[0]) {
            res.json({ result: "failed", message: 'Authentication failed. User not found.' });
        } else if (user[0]) {
            console.log("user.password");
            console.log(user[0].password);
            console.log("req.body.password");
            console.log(req.body.password);
            // check if password matches
            if (user[0].password != req.body.password) {
                res.json({ result: "failed", message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user[0], app.get('superSecret'), {
                    expiresIn: 1440 // expires in 24 hours
                });
                var decoded = jwt.verify(token, app.get('superSecret'));
                console.log("decoded........");
                console.log(decoded);
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    user:user[0]
                });
            }

        }
    });
});

router.post('/getarticlecomments', function (req, res) {
    var db = req.db;
    var articleId = req.body.articleid;
    var collection = db.get('commentcollection1');

    collection.find({articleid: articleId}, {limit:5, sort:{time:-1}}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result: "failed", message: "There was a problem adding the information to the database."});
        }
        else {
            res.send({result: "success", comments: docs});
        }
    });
});

router.post('/getarticlebyid', function (req, res) {
    var db = req.db;
    var articleId = req.body.articleid;
    var collection = db.get('articlecollection1');
    console.log("getarticlebyid");
    console.log(articleId);

    collection.find({_id: articleId}, {limit:5, sort:{time:-1}}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result: "failed", message: "There was a problem adding the information to the database."});
        }
        else {
            console.log(docs);
            res.send({result: "success", article: docs[0]});
        }
    });
});

router.post('/getuserbyid', function (req, res) {
    var db = req.db;
    var userId = req.body.userid;
    var collection = db.get('usercollection1');

    collection.find({_id:userId}, {limit:5, sort:{time:-1}}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result: "failed", message: "There was a problem adding the information to the database."});
        }
        else {
            console.log(docs);
            res.send({result: "success", user: docs[0]});
        }
    });
});

router.get('/getglobalfeed', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var article = req.body.type;

    // Set our collection
    var collection = db.get('articlecollection1');

    // Submit to the DB
    collection.find({},{limit:5, sort:{time:-1}}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            console.log(docs);
            res.json({result: "success", article : docs})
        }
    });
});

router.post('/getuserarticles', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes

    // Set our collection
    var collection = db.get('articlecollection1');
    //{'author.authorId':req.body.userid}
    // Submit to the DB
    collection.find({authorId :req.body.userid},{limit:5, sort:{time:-1}}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result:"failed",message:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page

            res.json({result: "success", article : docs})
        }
    });
});


/* GET Userlist page. */
router.get('/userlist', function (req, res) {
    var db = req.db;
    var collection = db.get('usercollection1');
    collection.find({}, {}, function (e, docs) {
         res.render('userlist', {
         "userlist" : docs
         });

        //res.send({"userlist": docs});
    });
});

module.exports = router;

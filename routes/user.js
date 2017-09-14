/**
 * Created by rabby on 11/09/2017.
 */
var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
 //console.log(router.app.get('superSecret'));
  var app = req.app;
  console.log(app.get('superSecret'));
  res.send('respond with a resource');
});


/*let userData = {id: "1", username: "rr", password: "rr",
 addressList: [{id: "1", name: "friend1", currentAddress:"address1"},
 {id: "2", name: "friend2",currentAddress:"address2"}]};*/
/* POST to Add User Service */
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
            res.redirect("userlist");
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

/* GET Userlist page. */
router.get('/userlist', function (req, res) {
    var db = req.db;

    var collection = db.get('usercollection1');
       collection.find({}, {}, function (e, docs) {
        /* res.render('userlist', {
         "userlist" : docs
         });*/
        console.log("hiii");
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
                    console.log(docs);
                    res.json({result: "success", user : docs})
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
                    console.log(docs);
                    res.json({result: "success", user : docs})
                }
            });

    });
});



module.exports = router;

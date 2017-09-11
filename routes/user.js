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
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username": userName,
        "password": userPassword,
        "email": userEmail,
        "following":[]
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",details:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            res.send({result: "registersuccess"});
           //router.post('/authenticate'
        }
    });
});


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
	console.log("req.body.name");
	console.log(req.body.name);
	var app = req.app;
	var db = req.db;

    var collection = db.get('usercollection');
    // Submit to the DB
    collection.find({
            "username": req.body.username
        }, function(err, user) {

            if (err) throw err;

            if (!user[0]) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user[0]) {
                console.log("user.password");
                console.log(user[0].password);
                 console.log("req.body.password");
                console.log(req.body.password);
                // check if password matches
                if (user[0].password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
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

    var collection = db.get('usercollection');
       collection.find({}, {}, function (e, docs) {
        /* res.render('userlist', {
         "userlist" : docs
         });*/

        res.send({"userlist": docs});
    });
});


router.post('/addfollowing', function (req, res) {
    var db = req.db;
    var userId = req.body.userid;
    var followId =  req.body.followid;
    var collection = db.get('usercollection');


    collection.update(
        {_id: userId},
        {$push: {following: {"_id":followId}}}, function (e, docs) {
        /* res.render('userlist', {
         "userlist" : docs
         });*/
        res.send({"user": docs});
    });
});


router.post('/getyourfeed', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var id = req.body.userid;
    var usercollection = db.get('usercollection');
    // Set our collection
    var collection = db.get('articlecollection');

        // Submit to the DB
    usercollection.find({_id:id},{}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result:"failed",details:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            console.log(docs[0].following);
               // Submit to the DB


        }
    }).then((docs) => {

        docs[0].following = [{ "author": "59b698be8e920a53fafd7a52"},{"author": "59b6b36b238bf2558572f2f2"}];
         collection.find({$or :docs[0].following},{limit:4, sort:{time:-1}}, function (err, docs) {

                if (err) {
                    // If it failed, return error
                    res.send({result:"failed",details:"There was a problem adding the information to the database."});
                }
                else {
                    // And forward to success page
                    console.log(docs);
                    res.json({result: "article added successfully", article : docs})
                }
            });

    })


});

module.exports = router;

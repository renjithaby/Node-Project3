var express = require('express');
var router = express.Router();

var loginId = null;


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Helloo World'});
});





/* GET New User page. */
router.get('/login', function (req, res) {
    res.render('login', {title: ' Sign In'});
});


/*let userData = {id: "1", username: "rr", password: "rr",
 addressList: [{id: "1", name: "friend1", currentAddress:"address1"},
 {id: "2", name: "friend2",currentAddress:"address2"}]};*/
/* POST to Add User Service */
router.post('/addarticle', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var article = req.body.article;
    console.log("req.body.article");
    console.log(req.body.article.title);
    console.log(req.body);

       var newArticle = {

        title: article.title,
        content:article.content,
        likes: 0,
        author:article.author,
        time:Date.now(),
        comments:[]
    }
 console.log(newArticle);
    // Set our collection
    var collection = db.get('articlecollection');



    // Submit to the DB
    collection.insert({
        "title": newArticle.title,
        "content":newArticle .content,
        "likes": 0,
        "author":newArticle .author,
        "time":Date.now(),
        "comments":[]
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send({result:"failed",details:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            console.log(doc);
            res.json({result: "article added successfully", article : doc})
        }
    });
});


router.get('/getglobalefeed', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var article = req.body.type;

    // Set our collection
    var collection = db.get('articlecollection');

    // Submit to the DB
    collection.find({},{limit:5, sort:{time:-1}}, function (err, docs) {

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
});


router.get('/getuserarticles', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes

    // Set our collection
    var collection = db.get('articlecollection');


    // Submit to the DB
    collection.find({_id:req.body.userid},{limit:2, sort:{time:-1}}, function (err, docs) {

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
});


router.get('/getyourfeed', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var id = req.body.id;
    var usercollection = db.get('usercollection');
    // Set our collection
    var collection = db.get('articlecollection');

        // Submit to the DB
    usercollection.find({_id:req.body.id},{}, function (err, docs) {

        if (err) {
            // If it failed, return error
            res.send({result:"failed",details:"There was a problem adding the information to the database."});
        }
        else {
            // And forward to success page
            console.log(docs[0].following);
               // Submit to the DB
            collection.find({ "_id": "59b698be8e920a53fafd7a52","_id": "59b6b36b238bf2558572f2f2"},{limit:10, sort:{time:-1}}, function (err, docs) {

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

        }
    });


});



/* GET Userlist page. */
router.get('/userlist', function (req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
         res.render('userlist', {
         "userlist" : docs
         });

        //res.send({"userlist": docs});
    });
});

/* GET New User page. */
router.get('/newuser', function (req, res) {


    res.render('newuser', {title: 'Add New User'});
});

router.get('/addaddress', function (req, res) {


    res.render('addaddress', {title: 'Add New Address', loginID: loginId});
});


/* POST to Add User Service */

router.post('/removeuser', function (req, res) {



    // Set our internal DB variable
    var db = req.db;
    console.log(req.query.id);
    //res.redirect("/userlist1");
    // Get our form values. These rely on the "name" attributes
    var id = req.query.id;


    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.remove({"_id": id}, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});


router.post('/addaddress', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var id = req.body.loginid;
    var addressId = Date.now();
    var name = req.body.name;
    var currentAddress = req.body.currentaddress;
    var newAddress = {"id": addressId, "name": name, "currentAddress": currentAddress};
    console.log("id...........");
    console.log(id);
    // Set our collection
    var collection = db.get('usercollection');


    collection.update(
        {_id: id},
        {$push: {addressList: newAddress}}
        , function (err, doc) {
            if (err) {
                console.log("failed.....");
                // If it failed, return error
                res.send({result :"failed",detail:"There was a problem adding the information to the database."});
            }
            else {

                console.log("doc[0]..........");
                console.log(doc);
                collection.find({
                        "_id" : id
                    },
                    function (err, doc) {
                        if (err) {
                            console.log("doceroor");
                            // If it failed, return error
                            res.send({result: "failed", detail:"Incorrect information."});
                        }
                        else {
                            console.log(".....response....");
                            if (doc.length > 0) {
                                res.send(doc[0]);
                                //res.redirect("addaddress");
                            } else {
                                res.send({result: "failed", detail:"wrong id"});
                            }
                        }
                    });
            }
        });


});


/*db.students.update(
    { _id: 4, "grades.grade": 85 },
    { $set: { "grades.$.std" : 6 } }
)*/


router.post('/updateaddress', function (req, res) {

   // req.body = {loginid:"59a67d114c0b230f4a639548",addressid:1504093882072,name :"renjith", currentaddress:"renjithadd"};
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var id = req.body.loginid;
    var addressId =req.body.addressid;
    var name = req.body.name;
    var currentAddress = req.body.currentaddress;
    var newAddress = {"id": addressId, "name": name, "currentAddress": currentAddress};
    console.log("id...........");
    console.log(id);
    console.log(addressId);
    console.log(currentAddress);
    // Set our collection
    var collection = db.get('usercollection');


    collection.update(
        {_id: id,"addressList.id":addressId},
        { $set: { "addressList.$" : newAddress } }
       , function (err, doc) {
            if (err) {
                console.log("failed.....");
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {

                console.log("doc[0]..........");
                console.log(doc);
                collection.find({
                        "_id" : id
                    },
                    function (err, doc) {
                        if (err) {
                            console.log("doceroor");
                            // If it failed, return error
                            res.send("Incorrect information.");
                        }
                        else {
                            console.log(".....response....");
                            if (doc.length > 0) {
                                res.send(doc[0]);
                                //res.redirect("addaddress");
                            } else {
                                res.send({result: "failed"});
                            }
                        }
                    });
            }
        });


});

/*
db.survey.update(
    { },
    { $pull: { results: { score: 8 , item: "B" } } },
    { multi: true }
)
*/
router.post('/removeaddress', function (req, res) {

    //req.body = {loginid:"59a67d114c0b230f4a639548",addressid:1504093406891};
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var id = req.body.loginid;
    var addressId =req.body.addressid;

    // Set our collection
    var collection = db.get('usercollection');


    collection.update(
        {_id:id},
        {$pull:{addressList:{id :addressId}}},
        { multi: true }
        , function (err, doc) {
            if (err) {
                console.log("failed.....");
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {

                console.log("doc[0]..........");
                console.log(doc);
                collection.find({
                        "_id" : id
                    },
                    function (err, doc) {
                        if (err) {
                            console.log("doceroor");
                            // If it failed, return error
                            res.send("Incorrect information.");
                        }
                        else {
                            console.log(".....response....");
                            if (doc.length > 0) {
                                res.send(doc[0]);
                                //res.redirect("addaddress");
                            } else {
                                res.send({result: "failed"});
                            }
                        }
                    });
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




function helloo() {

    console.log("you calle dme");
}

    module.exports = router;

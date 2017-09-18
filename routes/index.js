var express = require('express');
var router = express.Router();

var loginId = null;


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Helloo World'});
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
 console.log(newArticle);
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
            console.log(doc);
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
            console.log(docs);
            res.json({result: "success", article : docs})
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
            console.log(docs[0].following);
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
                    console.log(docs);
                    res.json({result: "success", article : docs})
                }
            });

    })


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




/*

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
    var collection = db.get('usercollection1');


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
*/

/*db.students.update(
    { _id: 4, "grades.grade": 85 },
    { $set: { "grades.$.std" : 6 } }
)*/

/*
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
    var collection = db.get('usercollection1');


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
*/
/*
db.survey.update(
    { },
    { $pull: { results: { score: 8 , item: "B" } } },
    { multi: true }
)
*/

/*
router.post('/removeaddress', function (req, res) {

    //req.body = {loginid:"59a67d114c0b230f4a639548",addressid:1504093406891};
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var id = req.body.loginid;
    var addressId =req.body.addressid;

    // Set our collection
    var collection = db.get('usercollection1');


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





function helloo() {

    console.log("you calle dme");
}


*/
    module.exports = router;

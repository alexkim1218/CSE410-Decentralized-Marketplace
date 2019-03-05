const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongodb = require('mongodb');
const currentUser = require('../config/passport');

/* GET homepage. */
router.get('/', function (req, res) {

    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost/blockchain_market';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the Server', err);
        } else {
            // Connected
            console.log('Connection established to', url);

            // In order to pull data from database,
            // We need to get the entire database first,
            // Then from there we take the collections we want.
            const productDatabase = db.db('blockchain_market');
            var collection = productDatabase.collection('products');

            // Find all students
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else if (result.length) {
                    // Make result global
                    global.datafromDB = result;
                    res.render('index', {
                        title: 'Big Market',
                        data: result
                    });
                } else {
                    res.send('No products found');
                }
                //Close connection
                db.close();
            });
        }
    });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user, title: 'Big Market', userUsername: req.user.username,
  })
);

// router.post('/dashboard',ensureAuthenticated,function (req, res){
//     const {name, price} = req.body;
//
// });



// About
router.get('/about', function (req, res) {
    res.render('about', {title: 'Big Market'});
});

// Index when logged in
router.get('/index-active', ensureAuthenticated, (req, res) =>
    res.render('index-active', {
        user: req.user, title: 'Big Market'})
);

// About when logged in
router.get('/about-active', ensureAuthenticated, (req, res) =>
    res.render('about-active', {
        user: req.user, title: 'Big Market'
    })
);

module.exports = router;

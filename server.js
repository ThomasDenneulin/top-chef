// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var scrap = require('./App.js');
var fs = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});
// more routes for our API will happen here

router.route('/restaurants')
    .get((req, res) => {
        scrap.LOAD_PROMO()
            .then(file => {
                fs.readFile(file, "utf8", (err, data) => {
                    data = JSON.parse(data);
                    data = data.sort((a, b) => {
                        return b.stars - a.stars
                    });
                    res.json(data);
                })
            })
            .catch(err => {
                console.log(err + "RETRY : ");
                scrap.LOAD_PROMO(); //If it fails, we retry
            });
    })
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
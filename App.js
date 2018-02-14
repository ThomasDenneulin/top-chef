var michelin = require('./michelin.js');
var lafourchette = require('./laFourchette');
var fs = require('fs');
//var tab = michelin.getRestaurants(1);
/*fs.readFile('./restaurants.json', function(err, data){
    var restaurants = JSON.parse(data);
    console.log(restaurants.resul[0]);
    restaurants.resul.forEach(element => {
        lafourchette.url(element.name);
    });
});*/
lafourchette.url('Le 39V');
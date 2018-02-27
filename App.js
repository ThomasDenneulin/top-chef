
//var michelin = require('./michelin.js');
var lafourchette = require('./laFourchette');
var fs = require('fs');
function LOAD_PROMO() {
    //var tab = michelin.getRestaurants(1);
    fs.readFile('./topchef/src/Restaurants.json', function (err, data) {
        var restaurants = JSON.parse(data);
        //console.log(restaurants[0]);
        //lafourchette.url(restaurants[56].name);
        var ids = []
        var requests = restaurants.map(restaurant => lafourchette.getId(restaurant.name));
        Promise.all(requests)
            .then(result => {
                ids = result;
                for (let i = 0; i < restaurants.length; i++) {
                    var element = restaurants[i];
                    element.id = ids[i];
                    console.log(element);
                }
                var promise = restaurants.map(restaurant => lafourchette.getPromo(restaurant.id));
                Promise.all(promise)
                    .then(result => {
                        for (let i = 0; i < restaurants.length; i++) {
                            var element = restaurants[i];
                            element.promo = result[i];
                            console.log(element);
                        }
                        fs.writeFile('./topchef/src/Restaurants.json', JSON.stringify(restaurants), function (err) {
                           console.log(DONE);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            /*var promise = restaurants.map(restaurant => lafourchette.getPromo(restaurant.id));
            Promise.all(promise)
                .then(result => {
                    var j = 0;
                    restaurants = restaurants.map(restaurant => {
                        restaurant.id = ids[i];
                        j++;
                    });
                    fs.writeFile('test.json', JSON.stringify(restaurants), function (err) {
                        if (err) throw err;
                        console.log("DONE");
                    })
                })*/
            .catch(error => console.log("ERROR------------------------------------" + error));
        /*for (let i = 0; i < restaurants.length; i++) {
            lafourchette.getId(restaurants[i].name)
                .then((data) => {
    
                    restaurants[i].id = data;
                    lafourchette.getPromo(data)
                        .then((promo) => {
                            restaurants[i].promo = promo;
                            ids.push(data)
                            console.log(ids.length);
                            if (ids.length == 496) {
                                fs.writeFile('restaurant.json', JSON.stringify(restaurants));
                            }
                        })
                        .catch(err => {
                            console.log("ERROR : "+err);
                        })
                });
        }*/

    });
}


module.exports.LOAD_PROMO = LOAD_PROMO;
//lafourchette.getId("Mère Brazier")
//.then((result)=>console.log("id :"+result));
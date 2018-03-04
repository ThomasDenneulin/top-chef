
//var michelin = require('./michelin.js');
var lafourchette = require('./laFourchette');
var fs = require('fs');

function LOAD_PROMO() {
    return new Promise((resolve, reject) => {
        fs.readFile('./topchef/src/Restaurants.json', function (err, data) {
            if (err) return reject(err);
            var restaurants = JSON.parse(data);
            var ids = []
            var requests = restaurants.map(restaurant => lafourchette.getId(restaurant.name,restaurant.locality,5));
            Promise.all(requests)
                .then(result => {
                    ids = result;
                    for (let i = 0; i < restaurants.length; i++) {
                        var element = restaurants[i];
                        element.id = ids[i];
                    }
                    var promise = restaurants.map(restaurant => lafourchette.getPromo(restaurant.id));
                    Promise.all(promise)
                        .then(result => {
                            for (let i = 0; i < restaurants.length; i++) {
                                var element = restaurants[i];
                                element.promo = result[i];
                            }
                            var file = './topchef/src/Restaurants.json';
                            fs.writeFile(file, JSON.stringify(restaurants), function (err) {
                                return resolve(file);
                            })
                        })
                })
                .catch(error => {return reject(error)});
        });
    })
}


module.exports.LOAD_PROMO = LOAD_PROMO;
//lafourchette.getId("Mère Brazier")
//.then((result)=>console.log("id :"+result));
const request = require('request');
const cheerio = require('cheerio');

var nbPages = 34;
var url;
var resul = []

function getRestaurants(i){
  if(i > nbPages) {
    return null;
  }
  else if(i == 1){
    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
  }
  else{
    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'+i;
  }
request(url, function (error, response, html) {
  //console.log(html);
  var $ = cheerio.load(html);
  $('.poi-search-result').find('.poi_card-display-title').each(function(index, element){ //Select each title of the result list
    var a = $(element); //Get his childrens
    resul.push(a.text().trim());
  });
  console.log(resul.length);
  console.log(resul[resul.length-1]);
  console.log(i);
  i++
  console.log(url)
  getRestaurants(i);
});
}


//getRestaurants(1);
//console.log(resul)
module.exports.getRestaurantsList = resul;
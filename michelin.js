
const request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');
var nbPages = 34;
var url;
var tab = [];
var resul = [];
var obj = { resul };

function getUrlRestaurant(i) {
  return new Promise((resolve, reject) => {
    if (i == 1) {
      url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
    }
    else {
      url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-' + i;
    }
    var urls = [];
    request(url, function (error, response, html) {
      if (error) {
        return reject(error);
      }
      //console.log(html);
      var $ = cheerio.load(html);
      $('.poi-search-result').find('.node--poi-card').each(function (index, element) { //Select each title of the result list
        var html = $(element); //Get his childrens
        var link = $(element).find("a").attr('href');
        urls.push(link);
      })
      return resolve(urls);
    })

  });
}

function getRest() {
  var urls = [];
  for (var i = 1; i < nbPages; i++) {
    tab.push(i);
  }
  var request = tab.map(page => getUrlRestaurant(page));
  Promise.all(request)
    .then(res => {
      urls = [];
      res.forEach(element => {
        urls = urls.concat(element)
      });
      return urls
    })
    .then(res => {
      var request = res.map(url => RequestAttribute(url));
      Promise.all(request)
        .then(res => {
          resul = res
          fs.writeFile('./topchef/src/Restaurants.json',JSON.stringify(resul),function(err){
            console.log("WRITED ON FILE")
          })
        })
    })
    .catch(console.log)
}

function RequestAttribute(url) {
  return new Promise((resolve, reject) => {
    request("https://restaurant.michelin.fr/" + url, (err, resp, html) => {
      if (err) return reject(err)
      var $ = cheerio.load(html)
      var name = $('.poi_intro-display-title').text().trim()
      //console.log(name);
      var postal = $('.postal-code').first().text().trim()
      //console.log(postal);
      var stars = $(".michelin-poi-distinctions-list").find(".content-wrapper").first().text();
      //console.log(stars[0]);
      var newRestaurant = { name: name, locality: postal, stars: stars[0] };
      return resolve(newRestaurant);
    })
  })
}


function getRestaurants(i) {
  if (i > nbPages) {
    var json = JSON.stringify(obj);
    var fs = require('fs');
    fs.writeFile('restaurants.json', json, 'utf8', function (err) {
      console.log("Writed in json file.")
    });
    return resul;
  }
  else if (i == 1) {
    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
  }
  else {
    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-' + i;
  }
  request(url, function (error, response, html) {
    //console.log(html);
    var $ = cheerio.load(html);
    $('.poi-search-result').find('.node--poi-card').each(function (index, element) { //Select each title of the result list
      var html = $(element); //Get his childrens
      var link = $(element).find("a").attr('href');
      console.log(link);
      request("https://restaurant.michelin.fr/" + link, function (error, response, html) {
        $ = cheerio.load(html);
        var name = $('poi_intro-description').find('.poi_intro-display-title').text().trim()
        console.log(name);
        var postal = $('.locality-block').find('.postal-code').text().trim()
        console.log(postal);
        var stars = $(".michelin-poi-distinctions-list > li > content-wrapper").text();
        console.log(stars)
        var newRestaurant = { name: name, locality: postal, stars: stars };
        resul.push(newRestaurant);
      })
      //var newRestaurant = {name : "" , locality : ""};
      //newRestaurant.name = a.text().trim();
      //resul.push({name : a.text().trim()});
      //Recup valeur du href
      //Request sur le href
      // Recuperation de locality
      //Creation Json
    });
    console.log(resul.length);
    console.log(resul[resul.length - 1]);
    console.log(i);
    i++
    console.log(url)
    getRestaurants(i);
  });
}
getRest()
//console.log(resul)
module.exports.getRestaurants = getRestaurants;
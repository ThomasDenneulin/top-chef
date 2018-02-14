//request sur l'url de la recherche
// Recup du bon restaurant dans la liste (via locality)
// ...
const request = require('request');
const cheerio = require('cheerio');

function JsonPromo(name){
    url = "https://www.lafourchette.com/search-refine/"+name;
    request(url, function(error,response,html){
        var $ = cheerio.load(html);
        var urlRestaurant = $('.resultItem').find('.resultItem-name').children().attr("href");
        console.log(urlRestaurant);
        url = "https://www.lafourchette.com"+urlRestaurant;
        request(url,function(error,response,html){
            var $ = cheerio.load(html);
            $(".saleType--event > .saleType-title").each(function(index,element){
                var a = $(element);
                console.log(a.text());
            });
        })
    })
}

module.exports.url = JsonPromo;
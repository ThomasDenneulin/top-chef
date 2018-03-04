var request = require('request');

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getId(name,locality) {
    return new Promise((resolve, reject) => {
            name = name.replace(/é|è|ê/g, "e");
            request('https://m.lafourchette.com/api/restaurant-prediction?name=' + name, (err, resp, html) => {
                if (err) {
                    console.log("error");
                    return resolve("Err");
                }
                else {
                    if (resp.statusCode == 400) {
                        return resolve('NOT FOUND');
                    }
                    else {
                        var json = JSON.parse(html);
                        var id = -1;
                        if(json[0]){
                        json.forEach(element => {
                            if(element.address.postal_code == locality){
                                console.log(element.name + " "+ element.address.postal_code+" : "+element.id);
                                id = element.id;
                            }
                        })
                    }
                       if (id != -1) {return resolve(id)}
                       else return resolve("NOT FOUND");
                    }
                }
            });
    })
}

function getPromo(id) {
    return new Promise((resolve, reject) => {
        try {
            var promo = [];
            request("https://m.lafourchette.com/api/restaurant/" + id + "/sale-type", (err, resp, html) => {
                if (err) {
                    return resolve("err");
                }
                try {
                    var json = JSON.parse(html);
                    json.forEach(element => {
                        if (element.is_special_offer) {
                            promo.push(element);
                        }
                    });
                    console.log("HAVE PROMO")
                    return resolve(promo);
                } catch (error) {
                    return resolve("PROMO NOT FOUND");
                }
            });
        }
        catch (error) {
            return reject(error);
        }
    })
}
module.exports.getId = getId;
module.exports.getPromo = getPromo;
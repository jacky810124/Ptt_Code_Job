var request = require('request');
var cheerio = require('cheerio');


var database = require('./database.js');


var ptt = 'https://www.ptt.cc';
var codeJobUrl = 'https://www.ptt.cc/bbs/CodeJob/index.html';


/**
 * get the latest post url on ptt
 * @param {Function} callback - the next function
 */
function getLatestPostUrl(callback) {

    request(codeJobUrl, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            $ = cheerio.load(body);

            var latestIndex = $('div.r-ent').length - 5;
            var latestUrl = $('div.r-ent').eq(latestIndex).find($('div.title>a')).attr('href');

            console.log('The latest post on ptt is: ' + latestUrl);
            callback(null, latestUrl);

        } else {

            console.log(error);
            callback(error, null);
        }
    });

}



/**
 * get the latest post content
 * @param {Function} callback  - the next function
 * @param {String}   latestUrl the latest post url on ptt
 */
function getLatestPostContent(callback, latestUrl) {

    database.saveDatabase(latestUrl);

    request(ptt + latestUrl, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            $ = cheerio.load(body);
            var title = $('.article-metaline').text();
            var content = $('#main-content').text();

            callback(null, true, title, content);

        } else {

            callback(error, null);
        }
    });
}


exports.getLatestPostUrl = getLatestPostUrl;
exports.getLatestPostContent = getLatestPostContent;

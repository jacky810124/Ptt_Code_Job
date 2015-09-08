var Firebase = require('firebase');
var ref = new Firebase('https://codejob.firebaseio.com');

/**
 * get the latest post url on database
 * @param {Function} callback  - next function
 * @param {String}   latestUrl the latest post url on database
 */
function getLatestPostUrl(callback, latestUrl) {

    console.log('Connecting firebase......');

    ref.once('value', function (result) {

        console.log('Latest post url on firebase is: ' + result.val().url);
        if (result.val().url === latestUrl) {

            callback(null, latestUrl, true);
        } else {

            callback(null, latestUrl, false);
        }
    }, function (error) {

        callback(error, null);
    });
}

/**
 * save the latest post url to database
 * @param {String} latestUrl - the latest post url
 */
function saveDatabase(latestUrl) {

    ref.set({
        url: latestUrl
    });
}


exports.getLatestPostUrl = getLatestPostUrl;
exports.saveDatabase = saveDatabase;

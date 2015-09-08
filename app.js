var async = require('async');
var CronJob = require('cron').CronJob;


var request = require('./request.js');
var database = require('./database.js');
var email = require('./email.js');

/**
 * start application
 */
function start() {

    new CronJob('*/15 * * * * *', function () {

        async.waterfall([

    /**
     * step1: get latest post url on ptt.cc
     * @param {Function} callback - the next function
     */
    function (callback) {

                    request.getLatestPostUrl(callback);
},
    /**
     * step2: get the latest url on database, then pass it to next function
     * @param {String}   latestUrl - the latest post url on ptt
     * @param {Function} callback  - the callback function
     */
    function (latestUrl, callback) {

                    database.getLatestPostUrl(callback, latestUrl);
},
    /**
     * step3: does database have the latest post url
     * @param {String}   latestUrl - the latest post url on ptt
     * @param {Boolean}  isLatest  does database have the latest post url 
     * @param {Function} callback  - the callback function
     */
    function (latestUrl, isLatest, callback) {


                    if (isLatest) {

                        console.log('You do not need to update');
                        callback(null, false, null, null);
                    } else {

                        console.log('Updating latest post');
                        request.getLatestPostContent(callback, latestUrl);
                    }
},
    /**
     * step4: send the post by email
     * @param {Boolean}  needSend - does the post need to be sent
     * @param {String}   title    - post title
     * @param {String}   content  - post content
     * @param {Function} callback - the callback function
     */
    function (needSend, title, content, callback) {

                    if (needSend) {

                        email.sendEmail(callback, title, content)
                    } else {

                        callback(null, 'You do not need to send email');
                    }

}],
            /**
             * all task have be done
             * @param {Object} error  - error object
             * @param {Object} result - resulte object
             */
            function (error, result) {

                if (error) {

                    console.log(error);
                } else {

                    console.log(result);
                }

            });

    }, null, true, "America/Los_Angeles");
}

exports.start = start;


start();
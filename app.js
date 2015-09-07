var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var Firebase = require('firebase');
var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');
var CronJob = require('cron').CronJob;



var ref = new Firebase('https://codejob.firebaseio.com');
var ptt = 'https://www.ptt.cc';
var codeJobUrl = 'https://www.ptt.cc/bbs/CodeJob/index.html';

var transporter = nodemailer.createTransport(directTransport());


new CronJob('* * * * * *', function () {

    
    async.waterfall([
    /**
     * get latest post on ptt code_job
     * @param {Function} callback - execute callback after request has done
     */
    function (callback) {

                request(codeJobUrl, function (error, response, body) {

                    if (!error && response.statusCode == 200) {

                        $ = cheerio.load(body);

                        var latestIndex = $('div.r-ent').length - 5;
                        var latestUrl = $('div.r-ent').eq(latestIndex).find($('div.title>a')).attr('href');

                        console.log('The latest post on ptt is: ' + latestUrl);
                        callback(null, latestUrl);

                    } else {
                        console.log(error);
                        callback(error, 'error: get latest post url');
                    }
                });
},
    /**
     * get latest post on firebase and compare
     * @param {String}   latestUrl - latest post url
     * @param {Function} callback  - execute callback after request has done
     */
    function (latestUrl, callback) {
                console.log('Connecting firebase......');
                ref.once('value', function (result) {


                    console.log('Latest post url on firebase is: ' + result.val().url);

                    if (result.val().url === latestUrl) {

                        callback(null, latestUrl, true);
                    } else {

                        callback(null, latestUrl, false);
                    }
                }, function (error) {

                    callback(error, 'error: firebase error');
                });

},
    /**
     * if you don't have the latest post url, then get the latest url, 
     * send to your mailbox, and save it on firebase
     * @param {String}   latestUrl - latest post url 
     * @param {Boolean}  isLatest  - is the latest?
     * @param {Function} callback  - execute callback after request has done
     */
    function (latestUrl, isLatest, callback) {


                if (isLatest) {

                    console.log('You do not need to update');
                } else {

                    console.log('Updating latest post');

                    request(ptt + latestUrl, function (error, response, body) {

                        if (!error && response.statusCode == 200) {

                            $ = cheerio.load(body);
                            var title = $('.article-metaline').text();
                            var content = $('#main-content').text();

                            var mailOptions = {
                                to: 'kang810124@gmail.com',
                                from: 'project_code_job@goodideas-campus.com',
                                subject: title,
                                text: content,
                                //                        html: '<b>Hello world ✔</b>' // html body
                            };


                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {

                                    callback(error, 'error: sending e-mail');
                                } else {

                                    console.log('Email has been sent');
                                    ref.set({
                                        url: latestUrl
                                    });

                                    callback(null, 'Send email success');
                                }
                            });

                        } else {

                            callback(error, 'error: updating latest post');
                        }
                    });

                }
}],
        /**
         * all task have done or an error occur
         * @param {Object} error  - an error object
         * @param {String} result - last success message
         */
        function (error, result) {

            if (error)
                console.log(error);
            else
                console.log(result);
        });



}, null, true, "America/Los_Angeles");

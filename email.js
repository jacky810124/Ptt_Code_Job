var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');


var transporter = nodemailer.createTransport(directTransport());


/**
 * send email
 * @param {Function} callback - the next function
 * @param {String}   title    - the latest post title
 * @param {String}   content  - the latest post content
 */
function sendEmail(callback, title, content) {

    var mailOptions = {
        to: 'kang810124@gmail.com',
        from: 'project_code_job@goodideas-campus.com',
        subject: title,
        text: content,
    };


    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {

            callback(error, null);
        } else {

            callback(null, 'Send email success');
        }
    });
}


exports.sendEmail = sendEmail;

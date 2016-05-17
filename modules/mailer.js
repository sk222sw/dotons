const apiKey = process.env.MAILGUN_API_KEY;
const domain = "dotons.xyz";
const mailgun = require("mailgun-js")({
  apiKey,
  domain
});
const from = "Dotons dotons@example.com"; // sender


const sendMail = function(options) {
  const data = {
    from,
    to: options.recipient,
    subject: options.subject,
    html: options.html
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) {
      // handle error
      console.log(error);
    } else {
      console.log(body);
    }
  });
}

module.exports = {
  sendMail
};


const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const MAILING_SERVICE = process.env.SMPT_SERVICE;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.SMTP_REDIRECT_URI;
const REFRECE_TOKEN = process.env.SMTP_REFRECE_TOKEN;
const MAILING_EMAIL = process.env.SMPT_EMAIL;
const OAUTH2_CLIENT = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

OAUTH2_CLIENT.setCredentials({
  refresh_token: REFRECE_TOKEN,
});

const sendEmail = async (options) => {
  // const ACCESS_TOKEN = await new Promise((resolve, reject) => {
  //   OAUTH2_CLIENT.getAccessToken((err, token) => {
  //     if (err) console.log(err); // Handling the errors
  //     else resolve(token);
  //   });
  // });
  const transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: `${process.env.EMAIL_PORT}`,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASSWORD}`
    },
  })
  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve('./routes/views/'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./routes/views/'),
  };

  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions))

  const mailOptions = {
    from: `<${process.env.EMAIL_USER}>`,
    ...options
  };

  let info = await transporter.sendMail(mailOptions)

  return info
};


module.exports = sendEmail;

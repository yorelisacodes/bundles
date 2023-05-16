const nodemailer = require('nodemailer');
const bundlesEmail = 'bundlesrc@outlook.com'

const sendEmail = ({ email, subject, text }) => { 
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: bundlesEmail,
      pass: 'bundles123$'
    }
  });
  
  const mailOptions = {
    from: bundlesEmail,
    to: 'rio.a.castillo@gmail.com', // eventually we'll swap this for the email variable
    subject,
    text
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log(`${subject} Email sent to ${email}`);
    }
  });
}

module.exports = { sendEmail }


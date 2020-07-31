require('./config/config');
require('./models/db');
require('./config/passportConfig');
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
//var nodemailer = require("nodemailer");
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');

var app = express();


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);


app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, HEAD, GET, OPTIONS, POST, PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});


app.post('/register', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        
        <li>Email: ${req.body.email}</li>
        
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "Gmail",
      //port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'abc@gmail.com', // generated ethereal user
          pass: 'password'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <abc@gmail.com>', // sender address
        to: 'abcd@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('contact', {msg:'Email has been sent'});
    });
    });
// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));
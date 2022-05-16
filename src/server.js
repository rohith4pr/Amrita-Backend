import express from 'express';
import bodyParser from 'body-parser';

const app = express();
var nodemailer = require('nodemailer');
app.use(bodyParser.json());
const database = require("./database.js"); 



app.get('/hello', (req,res) => res.send('Hello'));

app.post('/api/login-user-auth', async (req, res) => {
    const user = {username: req.body.tempUser, password: req.body.tempPassword};
    await database.checkUserLogin(user.username,user.password,res);
    
})

app.post('/api/signup-user-auth', async (req, res) => {
    const user = {username: req.body.tempUser, password: req.body.tempPassword, firstname: req.body.tempUserFirstname, secondname : req.body.tempUserSecondname};
    await database.checkUserSignup(user.username,user.password,user.firstname,user.secondname,res);
    
})

app.post('/api/add-blog', async (req, res) => {
    const user = {username: req.body.user, title: req.body.title, content: req.body.content,picLink: req.body.picLink,};
    
    await database.addNewBlog(user.username,user.title,user.content,user.picLink,res);
    
})

app.post('/api/send-contact', async (req, res) => {
    const user = {username: req.body.user, email: req.body.email, messages: req.body.messages};
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'akshaymohan99@gmail.com',
          pass: 'niavotplgpkoaysg'
        }
      });
      
      var mailOptions = {
        from: user.email,
        to: 'akshaymohan99@gmail.com',
        subject: `Message sent by ${user.username}`,
        text: user.messages
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
})

app.get('/api/get-all-blogs', async (req, res) => {
    
    await database.getAllBlogs(res);
    
})


app.listen(8000, () => console.log('Listening on port 8000'));
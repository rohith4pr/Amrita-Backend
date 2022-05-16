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
    const user = {username: req.body.name, email: req.body.email, messages: req.body.message};
    
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
        text: `${user.messages} \nRegards,\n${user.username} \n${user.email}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return res.status(200).json(error);
        } else {
          return res.status(200).json('Email sent: ' + info.response)
        }
      });
    
})

app.get('/api/get-all-blogs', async (req, res) => {
    
    await database.getAllBlogs(res);
    
})

app.get('/api/get-all-contributers', async (req, res) => {
    
  await database.getAllContributers(res);
  
})



app.listen(8000, () => console.log('Listening on port 8000'));
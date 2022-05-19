import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';


const app = express();
var nodemailer = require('nodemailer');
app.use(bodyParser.json());
const database = require("./database.js"); 
const fUpload = require("express-fileupload");
const proxy = "http://http://localhost:8000/";
app.use(fUpload());
const fs = require("fs");



app.get('/hello', (req,res) => res.send('Hello'));

// app.use(express.static(path.join(__dirname, '/build')));

app.get('/api/blog-images/:name', async (req, res) => {
  
      const imgName = req.params.name;
      let dirName = __dirname.replaceAll("\\","/");
      const img = dirName+"/media/"+imgName;

      fs.readFile(img, function(err,content){
        if(err){
          return res.status(200).json(err);
        }
        else{
          res.writeHead(200, { "Content-type" : "img/*" });
          res.end(content);
        }
      })

  
})

app.post('/api/login-user-auth', async (req, res) => {
    const user = {username: req.body.tempUser, password: req.body.tempPassword};
    await database.checkUserLogin(user.username,user.password,res);
    
})

app.post('/api/signup-user-auth', async (req, res) => {
    const user = {username: req.body.tempUser, password: req.body.tempPassword, firstname: req.body.tempUserFirstname, secondname : req.body.tempUserSecondname, social : req.body.social};
    await database.checkUserSignup(user.username,user.password,user.firstname,user.secondname,user.social,res);
})

app.post('/api/add-blog', async (req, res) => {

    const user = {username: req.body.user, title: req.body.title, content: req.body.content,picLink: req.body.picLink};
    
    await database.addNewBlog(user.username,user.title,user.content,user.picLink,res);
    
})

app.post('/api/add-blog-pic', async (req, res) => {

  let sampleFile =  req.files.file;
  const date = new Date();
  let dirName = __dirname.replaceAll("\\","/");
  const fileName = date.getTime()+sampleFile.name;
  let uploadPath = dirName+"/media/"+fileName;
  sampleFile.mv(uploadPath, function(err){
    if(err){
      return res.status(200).json({});
    }
  })
  return res.status(200).json({res : fileName});
  
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

app.post('/api/get-one-blog', async (req, res) => {
  const user = {blogno: req.body.currentBlog};
  
  await database.getOneBlogs(user.blogno,res);
    
  
})

app.post('/api/get-one-author', async (req, res) => {
  const user = {authId: req.body.authorId};
  
  await database.getOneAuth(user.authId,res);
    
  
})

app.get('/api/get-all-blogs', async (req, res) => {
    
    await database.getAllBlogs(res);
    
})

app.get('/api/get-all-contributers', async (req, res) => {
    
  await database.getAllContributers(res);
  
})

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/build/index.html'));
// })

app.listen(8000, () => console.log('Listening on port 8000'));
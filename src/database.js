
const initDatabase = () =>{
    const {
        createPool 
    } = require('mysql');
    
    const pool = createPool({
        host : "localhost",
        user : "root",
        password : "",
        database : "test",
        connectionLimit : 10
    })

    return(pool);
}

const getAll = async () =>{
    const pool = initDatabase();
    pool.query(`select * from user_details `,(err,result,fields) => {
        if(err){
            return(console.log(err));
        }
        return(console.log(result));
    })
}

const checkUserLogin = async (username,password,res) =>{
    const pool = initDatabase();
    pool.query(`select Password from user_details where Username = '${username}'`,(err,result,fields) => {
        if(err){
            return(err);
        }
        else if(result.length == 0){
            
            return res.status(200).json({"res": "notfound"});
        }
        else if(result[0]["Password"] === password){
            return res.status(200).json({"res": "passwordcorrect"});
        }
        else{
            return res.status(200).json({"res": "passwordwrong"});
        }
        
    })
}

const checkUserSignup = async (username,password,firstname,secondname,res) =>{
    const pool = initDatabase();
    pool.query(`select Username from user_details where Username = '${username}'`, (err,result,fields) => {
        if(err){
            return res.status(400).json({"res": "null"});
        }
        else if(result.length > 0){
            console.log("useralreadyexist")
            return res.status(200).json({"res": "useralreadyexist"});
        }
        else {
            pool.query(`INSERT INTO user_details(First_name, Second_name, Password, Username) VALUES ('${firstname}','${secondname}','${password}','${username}')` , (err,result,fields) => {
                if(err){
                    return res.status(400).json({"res": "null"});
                }
                return res.status(200).json({"res": "newuseradded"});
            })
        }
        
    })
}

const getAllBlogs = async (res) =>{
    const pool = initDatabase();
    pool.query(`SELECT * FROM blog_details WHERE 1`,(err,result,fields) => {
        if(err){
            return res.status(200).json({});
        }
        return res.status(200).json(result);
       
    })
}

const addNewBlog = async (username,title,content,picLink,res) =>{
    const pool = initDatabase();
    
    pool.query(`INSERT INTO blog_details (Author_id, Blog_title, Blog_content, Blog_img) VALUES ('${username}','${title}','${content}','${picLink}')`, (err,result,fields) => {
        if(err){
            console.log(err);
            return res.status(200).json({});
            
        }
        
        return res.status(200).json({"res": "newblogadded"});
        
    })
}


module.exports = { getAll,checkUserLogin , checkUserSignup, getAllBlogs, addNewBlog };
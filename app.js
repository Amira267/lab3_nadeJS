const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const dbclient = new mongodb.MongoClient("mongodb://localhost:27017");
dbclient.connect();

const db = dbclient.db('MyStudents');

app.set("view engine","ejs");
app.use(cookieParser());
app.use(cors());

app.get('/login' ,function(req,res){
    res.render("login.ejs");
});

app.post('/login',async function(req,res){
    let user = await db.collection("students").findOne({name: (req.body.username)});
    if(user && req.body.password == user.password){
        user.id = Math.random();
        res.cookie("sid",user.id)
        res.send("Done, Login success <3");
    }else{
        res.send("Sorry, Login Failed !");
    }
})

app.post('/addstudent', function(req,res){
    db.collection("students").insertOne(req.body);
    res.send({msg : "student added"})
});

app.listen(8080 , async function(req,res){
    console.log("server is up");
});
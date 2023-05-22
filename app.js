const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);

app.route('/')

.get(function(req, res){
    res.sendFile(__dirname + "/index.html");
})

.post(function(req, res){
    User.findOne({email: req.body.email}).then(function(result){
        if(!result){
            const newUser = new User({
            email: req.body.email,
            password: req.body.password
            });

            newUser.save();
            res.redirect('/successful.html');
        } else {
            res.render('login', {msg: "User already exists. Please log in."});
        }
    });

});

app.route('/successful.html')

.get(function(req, res){
    res.sendFile(__dirname + "/successful.html");
}).post();

app.route('/login')

.get(function(req, res){
    res.render('login', {msg : "Please enter your log in info."});
})

.post(function(req, res){
    User.findOne({email: req.body.email}).then(function(result){
        if(!result) {
            res.render('login', {msg: "Incorrect username or password."})
        } else {
            const userPassword = result.password;
            if(userPassword === req.body.password) {
                console.log('Logged in');
                res.sendFile(__dirname + '/loggedIn.html');
            } else {
                res.render('login', {msg: "Incorrect username or password."})
            }
        }
        
    });
});

app.route('/about')

.get(function(req, res){
    res.sendFile(__dirname + "/about.html");
});

app.route('/contact')

.get(function(req, res){
    res.sendFile(__dirname + "/contact.html");
});



app.listen(3000, function(){
    console.log('Server started on port 3000');
})
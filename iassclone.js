var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

var port = process.env.PORT || 8080;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
 });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.get('/api/',function(req , res){
    return res.send({error: false,message: 'hello'})
});

var dbConn = mysql.createPool({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'bda6a830ca3077',
    password: 'aa585ca3',
    database: 'heroku_5f935f4512cf32a'
});

// dbConn.connect();
module.exports = dbConn;

//Functions
//register
app.post('/api/register',function(req,res){
    var postData = req.body;
    dbConn.query('INSERT INTO icloneusers SET ?', postData, function (error,results,fields){
        if(error) throw error;
        return res.send({error:false, data: results, message: 'OK'});
    });
});

//login
app.post('/api/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    dbConn.query('SELECT * FROM icloneusers WHERE username = ? AND password =?', [username,password], function (error, results, fields){
        if(results.length > 0){
            return res.send({error:false, message: 'OK'});
        }else{ 
            return res.send({error: false, message: 'Incrorrect Login Details'});
        }
    });
});

app.post('/api/posts',function(req,res){
    var postData = req.body;
    dbConn.query('INSERT INTO icloneuserspost SET ?', postData, function (error,results,fields){
        if(error) throw error;
        return res.send({error:false, data: results, message: 'OK'});
    });
});

app.get('/api/posts/:username', function(req,res){
	let username = req.params.username;
	
	if(!username){
		return res.status(400).send({error: true, message: 'Please provide username'});
	}
	dbConn.query('SELECT * FROM icloneuserspost WHERE username =?', username,function(error, results, fields){
		if(error) throw error;
		return res.send({ error:false, data: results, message: 'posts.' });
	});
});


app.post('/api/createpost',function(req,res){
    var username = req.body.username;
    var base64str = req.body.base64str;
    var post = req.body.post;

    dbConn.query('INSERT INTO icloneuserspost (username, base64str, post) VALUES (?,?,?)',[username, base64str,post],function (error, results, fields){
        if (error) throw error;
        return res.send({error: false,data: results, message: 'Post Created'});
        });
});


app.listen(port,function(){
    console.log('App running on Port: '+port);
});

module.exports = app;
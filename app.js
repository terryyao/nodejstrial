/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var setup = require('./lib/express_setup')
var routes = require('./routes')

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv =  cfenv.getAppEnv();

var setupOptions = {
  baseDir: __dirname,
  i18nNameSpaces: ['login']
}

setup.setup(app, setupOptions);

app.get("/", routes.home);
app.get("/login", routes.login);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// start server on the specified port and binding host
app.listen(process.env.port || appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

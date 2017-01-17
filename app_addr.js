// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder'); 

var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');

var connection = require('./connection');
var routes = require('./routes');
var https = require('https');
var https = require('http');


var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({ extended: true }));
//app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'html');

connection.init();
routes.configure(app);

// Setup Restify Server
/*var server = restify.createServer();	
server.listen(process.env.PORT || 8000, function() 
{
   console.log('%s listening to %s', server.name, server.url); 
});*/

// Start listening
var port = process.env.port || process.env.PORT || 8000;
app.listen(port, function () {
  console.log('Web Server listening on port %s', port);
});

app.get('/', (req, res, next) => res.render('index.html', { title: 'Customer Support' }));

/*server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));*/

// Create chat bot
var connector = new builder.ChatConnector
({ appId: process.env.MY_APP_ID, appPassword: process.env.MY_APP_PWD }); 

var bot = new builder.UniversalBot(connector);
//server.post('/api/messages', connector.listen());
app.post('/api/messages', connector.listen());


// Catch 404 and forward to error handler
/*app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

//var router = express.Router();


var customer = [];  
var address;  

var extServerOptions = {
    host: 'http://LowCost-env.mv7nkzxkh2.us-west-2.elasticbeanstalk.com',
    port: '80',
    path: '/customers/John',
    method: 'GET'
};
function get() {
    http.request(extServerOptions, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            customer = JSON.parse(data);
            customer.foreach(function (e) {
                console.log(e.id + "\t" + e.address + "\t" + e.firstName + "\t" + e.lastName);
            });
        });
 
    }).end();
};

function getCustomerDetails(callback){
 return http.get("http://lowcost-env.mv7nkzxkh2.us-west-2.elasticbeanstalk.com/customers/John", function(res) { 
	  var d = '';  
        var i;  
      //  arr = [];  
	
        res.on('data', function(chunk) {  
            d += chunk;  
        }); 

			res.on('end', function() {
			var parsed  =JSON.parse(d);
			console.log(parsed);

		callback({
                id: parsed.id,
                firstName: parsed.firstName,
				address: parsed.address
            });
              
        });  
	  });  
}




// Create bot dialogs

bot.dialog('/', [
    function (session) {
        session.beginDialog('/askName');
    },
    function (session, results) {
		session.userData.name = results.response;
		session.send('Hello %s! How may I help you?', results.response);
		//getBooksData(results.response);  
		//getCustomerDetails();
		get();
		session.beginDialog('rootMenu');
	}
			
		
]);
bot.dialog('/askName', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    }
   /*, function (session, results) {
        session.endDialogWithResult(results);
    }*/
]);

// Add root menu dialog
bot.dialog('rootMenu', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Address Update|Add New Vehicle to Policy|Buy Policy|Quit');
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('updateAddress');
                break;
            case 1:
                session.beginDialog('newVehicle');
                break;
            case 2:
                session.beginDialog('buyPolicy');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('rootMenu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('updateAddress', [
    function (session, args) {
        builder.Prompts.text(session, "Please enter new address details.")
    },
    function (session,results) {

		session.send('your address: %s', results.response);
		session.beginDialog('confirmAddress');
        
    }
]);

bot.dialog('confirmAddress', [
    function (session, args) {
        builder.Prompts.text(session, "Please confirm the address")
    },
    function (session, results) {
		
		session.send('Thanks for confirming the address. Address updated.', results.response);
			
        
    }
]);

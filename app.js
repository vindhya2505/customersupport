// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder'); 
// Setup Restify Server
var server = restify.createServer();	
server.listen(process.env.PORT || 8000, function() 
{
   console.log('%s listening to %s', server.name, server.url); 
});

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));


// Create chat bot
var connector = new builder.ChatConnector
({ appId: process.env.MY_APP_ID, appPassword: process.env.MY_APP_PWD }); 

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


var arr	= [];
var addrData	= [];


function getCustomerDetails(key){
 http.get("http://lowcost-env.mv7nkzxkh2.us-west-2.elasticbeanstalk.com/customers/"+key, function(res) { 
	  var d = '';  
      arr = [];  
	      res.on('data', function(chunk) {  
            d += chunk;  
        }); 
			res.on('end', function() {
			var e  =JSON.parse(d);		
			arr.push({  
                    "id": e.id,  
                    "firstName": e.firstName,  
                    "lastName": e.lastName,  
                    "email": e.email  ,
					"mobile": e.mobile  ,
					"dateOfBirth": e.dateOfBirth ,
					"address": e.address  
                }); 
			console.log("address" +arr[0]['id']);
			console.log("address" +arr[0]['address']);
			//console.log("address var" +address);
        });  
	  });  
}




bot.dialog('/', [
    function (session, args, next) {
      
            session.beginDialog('/welcome');
			next();
      
    },
    function (session,args, next) {
		 if (!session.userData.name) {
		 session.beginDialog('/profile');
		 }else{
		 next();
		 }
    }, 
	function (session,args, next) {
		
		 session.beginDialog('/rootMenu');
		 //next();
		
    },
		
		function (session, results) {
		session.send( session.userData.name + 
                     " ! your address details are updated : ");
    }
]);

bot.dialog('/welcome', [
    function (session) {
        session.send('Hi! I am support bot!. Lets Get Started!');
		session.send("I can help you buy/renew motor insurance or provide you general assistance such as personal detail update."); 
		session.send("Please provide your details."); 
    },
		function (session, results) {
   
			session.endDialog();
    }
	
]);
bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.text(session, "Hi " + results.response + ", What is your email id?"); 
    },
	function (session, results) {
        session.userData.email = results.response;
        //builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
		session.send("Thanks you for providing your details."); 
			session.endDialog();
    }
]);



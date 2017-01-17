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

bot.dialog('/rootMenu', [
    function (session) {
        session.send("Please choose an option from the menu:");
        builder.Prompts.choice(session, "", ["BUY OR RENEW", "POLICY STATUS", "GENERAL ASSISTANCE"]);
    },
    function (session, results) {
       
		console.log("option" +results.repsonse);
    },
   
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });
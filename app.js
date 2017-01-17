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
    function (session) {
        session.beginDialog('/askName');
    },
    function (session, results) {
		session.userData.name = results.response;
		session.send('Hello %s! How may I help you?', results.response);
		
	}
			
		
]);
bot.dialog('/askName', [
    function (session) {
        builder.Prompts.text(session, 'Hello! Provide your details. What is your name?');
    }
   , function (session, results) {
        session.endDialogWithResult(results);
    }
]);
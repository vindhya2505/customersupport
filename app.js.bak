// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder'); 

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function() 
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

// Create bot dialogs

bot.dialog('/', [
    function (session) {
        session.beginDialog('/askName');
    },
    function (session, results) {
        session.send('Hello %s! How may I help you?', results.response);
		session.beginDialog('rootMenu');
    }
]);
bot.dialog('/askName', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
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
		
		session.send('Thanks for confirming the address. This address will be updated.', results.response);
			
        
    }
]);
/*bot.dialog('/', function (session) {
    session.send("Hello ! I can help you with 1. Address update, 2. Add vehicle to the Policy. Please choose the options 1..2..");
});*/
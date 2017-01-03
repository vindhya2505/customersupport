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

			switch (results.resonse.index) {
            case 0:
               // session.beginDialog('doorNumber');

			 console.log("[200] " + req.method + " to " + req.url);
          results.resonse.writeHead(200, "OK", {'Content-Type': 'text/html'});
          results.resonse.write('<html><head><title>Hello<body>');
          results.resonse.write('<h1>Welcomeo are you?</h1>');
          results.resonse.write('<form="application/x-www-form-urlencoded" action="/formhandler" method="post">');
          results.resonse.write('DoorNumber : <input type="text" name="dno" value="" /><br />');
          results.resonse.write('Address1 :<input type="text" name="addr1" value="" /><br />');
          results.resonse.write('<input type="submit"  value="submit"/>');
          results.resonse.write('</form></body></html>');
                break;
            case 1:
                session.beginDialog('address1');
                break;
            case 2:
                session.beginDialog('city');
                break;
			case 3:
				session.beginDialog('State');
				break;
            default:
                session.endDialog();
                break;
        }
        
    }
]);

bot.dialog('doorNumber', [
    function (session, args) {
        builder.Prompts.number(session, "Enter Door Number")
    },
    function (session, results) {

			switch (results.response.index) {
            case 0:
                session.beginDialog('doorNumber');
                break;
            case 1:
                session.beginDialog('address1');
                break;
            case 2:
                session.beginDialog('city');
                break;
			case 3:
				session.beginDialog('State');
				break;
            default:
                session.endDialog();
                break;
        }
        
    }
]);
/*bot.dialog('/', function (session) {
    session.send("Hello ! I can help you with 1. Address update, 2. Add vehicle to the Policy. Please choose the options 1..2..");
});*/
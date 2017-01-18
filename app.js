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
        switch (results.response.entity) {
            case "BUY OR RENEW":
                session.replaceDialog("/buyorrenew");
                break;
			case "POLICY STATUS":
				session.replaceDialog("/policystatus");
				break;
            default:
                session.replaceDialog("/support");
				
                break;
        }
		//console.log("option" +results.repsonse.entity);
    },
    function (session) {
        // Reload menu
        session.replaceDialog('/rootMenu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('/support', [
   function(session) {  
        builder.Prompts.text(session, 'Hi '+session.userData.name+" ! what is the exact assistance you are looking for?");  
    },  
    function(session, results) {  
        session.send('O.k You are looking for assistance related to  - %s', results.response);  
        var b = [];  
     	getCustomerDetails(session.userData.name);
		  //session.replaceDialog("/address");
    }  
]);

var intents = new builder.IntentDialog();  
//bot.dialog('/address', intents);  

intents.matches(/^yes?/i, [  
    function(session) {  
     
	   var cust = arr[0];  
		session.userData.custid=cust.id;
	 session.send(" Your current  details are : :ID: "+cust.id+"Name:" + cust.firstName + ", Last Name: " + cust.lastName + ", Email :" + cust.email+ ", Address : " + cust.address);  
	  builder.Prompts.text(session, "Please enter pin code of new address");  
		
    },  
    function(session, results) {  
		session.userData.pincode= results.response;
        validatepincode(session.userData.pincode);	
			
    }  
]); 
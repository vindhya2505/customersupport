var builder = require('botbuilder');
var http = require('http');
var https = require('https');





var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);



var arr	= [];
var addrData	= [];


function getCustomerDetails(key){
 http.get("http://localhost:8080/Spring4MVCHelloWorldRestServiceDemo/customers/"+key, function(res) { 
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

function validatepincode(key){
https.get("https://www.whizapi.com/api/v2/util/ui/in/indian-city-by-postal-code?pin="+key+"&project-app-key=18t3orqpqwhhmp1ssdfm7ett", function(res) { 
	  var d = '';  
      addrData = [];  
	   var i;  

	      res.on('data', function(chunk) {  
            d += chunk;  
        }); 
			res.on('end', function() {
			var e  =JSON.parse(d);		
			//console.log(e);
		//	addrData.push({"responsecode":e.ResponseCode});
			 for (i = 0; i < e.Data.length; i++) {  
               // console.log(i + 1 + ":" + e.Data[i].Address);  
				  addrData.push({  
                    "address": e.Data[i].Address,  
                    "city": e.Data[i].City,  
                    "state": e.Data[i].State,  
                    "country": e.Data[i].Country,
					"pincode" :e.Data[i].Pincode
                });  
                
            }  

        });  
	  });  
}

function updateProfile(key,updatefield){
	
	var jsonObject = JSON.stringify(
		  {"id":"C101","firstName":"abc","lastName":"k","email":"vindy@gmail.com","mobile":"121-232-3435","dateOfBirth":1484116667527,"address":updatefield}
		);

	// prepare the header
	var headers = {
		'Content-Type' : 'application/json',
		'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
	};
	// the post options
	var optionsput = {
		host : 'localhost',
		port : 8080,
		path : "/Spring4MVCHelloWorldRestServiceDemo/customers/update/"+key,
		method : 'PUT',
		headers : headers
	};

	console.info('Options prepared:');
	console.info(optionsput);
	console.info('Do the PUT call');
	// do the POST call
	var reqPut = http.request(optionsput, function(res) {
		console.log("statusCode: ", res.statusCode);
		// uncomment it for header details
	//  console.log("headers: ", res.headers);
	 
		res.on('data', function(d) {
			console.info('PUT result:\n');
			process.stdout.write(d);
			console.info('\n\nPUT completed');
		});
	});
	 
	// write the json data
	reqPut.write(jsonObject);
	reqPut.end();
	reqPut.on('error', function(e) {
		console.error(e);
	});
}



bot.dialog('/', [
    function (session, args, next) {
      
            session.beginDialog('/welcome');
			next();
      
    },
    function (session,args, next) {
		 if (!session.userData.name) {
			 console.log("I am here");
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


bot.dialog('/buyorrenew', [
    function (session) {
        builder.Prompts.choice(session, "Lets Get Started "+session.userData.name+". Choose your option", ["Car", "Bike"]);
    },
    function (session, results) {
        switch (results.response.entity) {
            case "Car":
                session.replaceDialog("/car");
                break;
			default:
                session.replaceDialog("/bike");
                break;
        }
		//console.log("option" +results.repsonse.entity);
    }
]);


bot.dialog('/car', [
    function (session) {
		 session.send("Sure. Happy to help. We work with all major insurers.");
        // builder.Prompts.text(session, 'Do you know your car number? eg:KA05 7326');
		 builder.Prompts.text(session, "Please enter your car number? eg:KA05 7326");
    },
    function (session, results) {
		session.userData.carnumber=results.response;
		console.log("car number" +session.userData.carnumber);
        session.beginDialog("/showcardetails");
		
    }
]);


bot.dialog('/showcardetails', [
    function (session) {
		console.log("car number in show car" +session.userData.carnumber);
		//var cardetails = carData[session.userData.carnumber];
		getCustomerDetails(session.userData.name);
		var customer =arr[0];
console.log("customer::" +customer.address);

      //   session.send("your car model %(model)d and make year %(year)s.", cardetails); 
		 //builder.Prompts.text(session, "Please enter RTO ID eg: MH01 MH02");
    },
    function (session, results) {
      console.log(" cardetails :" +cardetails);

    }
]);

bot.dialog('/support', [
   function(session) {  
        builder.Prompts.text(session, 'Hi '+session.userData.name+" ! what is the exact assistance you are looking for?");  
    },  
    function(session, results) {  
        session.send('O.k You are looking for assistance related to  - %s', results.response);  
        var b = [];  
     	getCustomerDetails(session.userData.name);
		  session.replaceDialog("/address");
    }  
]);



var intents = new builder.IntentDialog();  
bot.dialog('/address', intents);  

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



intents.matches(/^options?/i, [  
    function(session) {  
			var addr = addrData.length;
			var choicestr ='';
		 for (var i=0;i<addr;i++){
		 choicestr += addrData[i].address+","+ addrData[i].city+","+ addrData[i].state+","+ addrData[i].country;
			if(i<addr-1){
				 choicestr += "|";
			}
		 }
		 arr =[];
		console.log("arr length>"+arr.length);
	 builder.Prompts.choice(session, "we have the these options to suggest for the pincode entered"+session.userData.pincode+" :  Choose your option ", choicestr);

    },  
    function(session, results) {  
		session.userData.optionaddress = results.response.entity;
		console.log("my option address->"+session.userData.optionaddress);
		//builder.Prompts.choice(session, "Are you sure you want to update this address with this option? : "+session.userData.optionaddress, ["OK","Cancel"]);
		updateProfile(session.userData.custid,session.userData.optionaddress);
		//getCustomerDetails(session.userData.name);
		session.send(session.userData.name +" ! you have chosen the address :"+session.userData.optionaddress);
		builder.Prompts.choice(session, "Are you sure you want to update this address with this option? : "+session.userData.optionaddress, ["OK","Cancel"]);
	
    }
	 
]); 




 
intents.matches(/^can i see updated details?/i, [  
    function(session) {  
		session.send(" Please wait ! While I retrieve your new address details");
		
    },  
    function(session, results) {  
		session.send("%s",results.response);
		
    }  
]); 


intents.matches(/^ok/i, [  
    function(session) {  
		 var cust = arr[0];  
		//session.userData.custid=cust.id;
		console.log("arr length>"+cust.address);
	 session.send(" Your new  details are : :ID: "+cust.id+" Name:" + cust.firstName + ", Last Name: " + cust.lastName + ", Email :" + cust.email+ ", Address : " + cust.address);  
    },  
    function(session, results) {  
		  session.send(" Thanks you");
		session.beginDialog("/rootMenu");
    }  
]); 







 
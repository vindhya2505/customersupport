var builder = require('botbuilder');  
var https = require('https');  
var http = require('http');  
var parseString = require('xml2js').parseString;
var connector = new builder.ConsoleConnector().listen();  
var bot = new builder.UniversalBot(connector);  
var arr = [];  
  
function getBooksData(key) {  
    https.get("https://www.googleapis.com/books/v1/volumes?q=" + key + "&maxResults=5", function(res) {  
        var d = '';  
        var i;  
        arr = [];  
        res.on('data', function(chunk) {  
            d += chunk;  
        });  
        res.on('end', function() {  
            var e = JSON.parse(d);  
            for (i = 0; i < e.items.length; i++) {  
                console.log(i + 1 + ":" + e.items[i].volumeInfo.title);  
                arr.push({  
                    "description": e.items[i].volumeInfo.description,  
                    "title": e.items[i].volumeInfo.title,  
                    "saleability": e.items[i].saleInfo.saleability,  
                    "price": e.items[i].saleInfo.listPrice  
                });  
            }  
        });  
    });  
}  
function getCustomerDetails(key){
// http.get("http://lowcost-env.mv7nkzxkh2.us-west-2.elasticbeanstalk.com/customers/"+key, function(res) { 
   http.get("http://localhost:8080/Spring4MVCHelloWorldRestServiceDemo/customers/"+key, function(res) { 
	  var d = '';  
        var i;  
        arr = [];  
	
        res.on('data', function(chunk) {  
            d += chunk;  
        }); 

			res.on('end', function() {
			var e  =JSON.parse(d);
			console.log("e:::"+e);
			console.log("I am from the local service ::::" + ":" + e.firstName); 
			console.log("I am from the local service ::::" + ":" + e.address); 
			console.log("I am from the local service ::::" + ":" + e.dateOfBirth); 
			address =e.address;
			arr.push({  
                    "id": e.id,  
                    "firstName": e.firstName,  
                    "lastName": e.lastName,  
                    "email": e.email  ,
					"mobile": e.mobile  ,
					"dateOfBirth": e.dateOfBirth ,
					"address": e.address  
                }); 
			console.log("address" +arr[0]['address']);
			console.log("address var" +address);
              
        });  
	  });  
}
function getCarData(key) {  
    http.get("http://www.regcheck.org.uk/api/reg.asmx/CheckIndia?RegistrationNumber=" + key + "&username=vindhya", function(res) {  
        var d = '';  
        var i;  
        arr = [];  
        res.on('data', function(chunk) {  
            d += chunk;  
        });  
        res.on('end', function() {  
			console.log(d);  
			var jsonText = JSON.stringify(d);
		
           /* var e = JSON.parse(d);  
            for (i = 0; i < e.items.length; i++) {  
                console.log(i + 1 + ":" + e.items[i].vehicleJson.Description);  
                 
            }  */
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



var intents = new builder.IntentDialog();  
bot.dialog('/', intents);  
intents.matches(/^Hi/i, [  
    function(session) {  
        builder.Prompts.text(session, 'Hey, I am a BookBot. Welcome to Book Searching through Chat!.To start, which books you would like to search?');  
    },  
    function(session, results) {  
        session.send('Here are books for topic - %s.', results.response);  
        var b = [];  
      // getBooksData(results.response);  
		//getCarData("KA05MR7326");
		//getCustomerDetails("abc");
		updateProfile("C101","JP nagar hulimavu bangalore");
    },  
    function(session) {  
        builder.Prompts.text(session, 'which books');  
    }  
]);  
intents.matches(/^info?/i, [  
    function(session) {  
        builder.Prompts.choice(session, "Which book's info you need?", "1|2|3|4|5");  
		 var cust = arr[0];  
		 console.log("I am from session ::::" + ":" + cust.firstName); 
    },  
    function(session, results) {  
		console.log("results.response.entity "+results.response.entity );
       // var cust = arr[0];  
      /*  if (book.saleability == 'FOR_SALE') {  
            session.send('Title:' + book.title + " Price:" + book.price.amount + " " + book.price.currencyCode);  
        } else {  
            session.send('Title:' + book.title + " Price: NOT FOR SALE");  
        }  */
		//console.log("I am from tdailooge ::::" + ":" + cust.firstName); 
	//		console.log("I am from tdailooge ::::" + ":" + cust.address); 
		//	console.log("I am from tdailooge ::::" + ":" + cust.dateOfBirth); 
     //   session.send('Description:' + cust.address);  
		
    }  
]);  
intents.onDefault(builder.DialogAction.send('Hi there! How can I help you today?'));  
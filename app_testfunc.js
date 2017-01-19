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
			var jsonText = JSON.stringify(xmlToJson(d));

           /* var e = JSON.parse(d);  
            for (i = 0; i < e.items.length; i++) {  
                console.log(i + 1 + ":" + e.items[i].vehicleJson.Description);  
                 
            }  */
        });  
    });  
}


// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	//if (xml.childNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	//}
	return obj;
};




var intents = new builder.IntentDialog();  
bot.dialog('/', intents);  
intents.matches(/^Hi/i, [  
    function(session) {  
        builder.Prompts.text(session, 'Hey, I am a BookBot. Welcome to Book Searching through Chat!.To start, which books you would like to search?');  
    },  
    function(session, results) {  
        session.send('Here are books for topic - %s.', results.response);  
        var b = [];  
      //  getBooksData(results.response);  
		getCarData("KA05MR7326");
    },  
    function(session) {  
        builder.Prompts.text(session, 'which books');  
    }  
]);  
intents.matches(/^info?/i, [  
    function(session) {  
        builder.Prompts.choice(session, "Which book's info you need?", "1|2|3|4|5");  
    },  
    function(session, results) {  
        var book = arr[results.response.entity - 1];  
        if (book.saleability == 'FOR_SALE') {  
            session.send('Title:' + book.title + " Price:" + book.price.amount + " " + book.price.currencyCode);  
        } else {  
            session.send('Title:' + book.title + " Price: NOT FOR SALE");  
        }  
        session.send('Description:' + book.description);  
    }  
]);  
intents.onDefault(builder.DialogAction.send('Hi there! How can I help you today?'));  
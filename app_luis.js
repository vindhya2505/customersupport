var builder = require('botbuilder');
var restify = require('restify');

var bot = new builder.BotConnectorBot({
    appId: 'YourAppId',
    appSecret: 'YourAppSecret'
});

//var dialog = new builder.LuisDialog('https://api.projectoxford.ai/luis/v1/application?id=ID&subscription-key=KEY&q=');
var dialog = new builder.LuisDialog('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6cab81b1-17f9-415f-a77f-67ff8b65c7ce?subscription-key=a8d4adc7aa234469a152a2cb7aba741f&q=&verbose=true');
bot.add('/', dialog);

// insert intent handlers here

var server = restify.createServer();
server.post('/v1/messages', bot.verifyBotFramework(), bot.listen());

server.listen(process.env.port || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});
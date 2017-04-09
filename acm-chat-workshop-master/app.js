const restify = require('restify')
const builder = require('botbuilder')
const config = require('./config.js')
var cognitiveservices = require('botbuilder-cognitiveservices');


//
//    Bot stuff
//

var concepts = ['Car', 'Campfire', 'Windmill', 'Hammer'];
var clothes = new HashTable({blueshirt: 1, reddress: 2, greyshirt: 3});
//var website = '';

// Connection to Microsoft Bot Framework
const connector = new builder.ChatConnector({
  appId: config.appId,
  appPassword: config.appPassword,
});
const bot = new builder.UniversalBot(connector);

var recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: '67e04557-1c27-4045-b1c1-8469aab5e53c', 
	subscriptionKey: 'fe6e8e5c4d364d4ebb55428ec4030b48'});
	
var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({ 
	recognizers: [recognizer],
	defaultMessage: 'No match! Try changing the query terms!',
	qnaThreshold: 0.3});

var intents = new builder.IntentDialog();

// Event when Message received
bot.dialog('/', (session) => {
  session.send("Hello beautiful!");
  session.replaceDialog('/greeting');
});

bot.dialog('/greeting', (session) => {
  session.send("How are you doing?");
  session.replaceDialog('/intents');
});
bot.dialog('/intents', intents);
/*intents.matches(/^Hi/i, [
    function(session){
        session.replaceDialog('/');
    }
]);*/

intents.matches(/^(.*)I try(.*)something(.*)/i, [
    /*function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }*/
    function (session){
        builder.Prompts.text(session, 'Absolutely! What would you like to try on?');
    },
    function (session, results) {
        
        var clothing = results.response;
        clothing = clothing.replace(/\s/g, '');
        clothing = clothing.toLowerCase();
        if (clothes.hasItem(clothing)){
            //session.send('if');
            session.send("Check it out, you look amazing!");
            var website = 'https://mirroar.herokuapp.com/';
            if (clothing === 'reddress'){
                website = website.concat(clothing);
            }
            else if (clothing === 'blueshirt'){
                website = website.concat('blueShirt');
            }
            else if (clothing === 'greyshirt'){
                website = website.concat('greyShirt');
            }
            website = website.concat('.html');
            var card = createClothingCard(session, website);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
        }
        else {
            session.send("You can choose from these options:");
            var card = createChoiceCard(session);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            //session.send('else');
        }
        //session.endDialog();
    }
]);

bot.beginDialogAction('blueshirt', '/blueshirt');
bot.dialog('/blueshirt', (session) =>{
            var website = 'https://mirroar.herokuapp.com/blueShirt.html';
            var card = createClothingCard(session, website);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            session.replaceDialog('/intents');
});
bot.beginDialogAction('reddress', '/reddress');
bot.dialog('/reddress', (session) =>{
            var website = 'https://mirroar.herokuapp.com/reddress.html';
            var card = createClothingCard(session, website);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            session.replaceDialog('/intents');
});
bot.beginDialogAction('greyshirt', '/greyshirt');
bot.dialog('/greyshirt', (session) =>{
            var website = 'https://mirroar.herokuapp.com/greyShirt.html';
            var card = createClothingCard(session, website);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            session.replaceDialog('/intents');
});
/*bot.dialog('/yes', (session) => {
  var card = createChoiceCard(session);
  var msg = new builder.Message(session).addAttachment(card);
  session.send(msg);
  
});*/


/*bot.beginDialogAction('choice', '/choice');
bot.dialog('/choice', (session) => {
  session.send("choice was clicked");
  session.endConversation();

});

bot.beginDialogAction('ready', '/ready');
bot.dialog('/ready', (session) => {
  session.send("ready was clicked");
  session.endConversation();

});*/
function createClothingCard(session, website) {
    return new builder.HeroCard(session)
        .title('Mirroar')
        .subtitle('Your favorite Mirror')
        .text('See how clothes look on you with just a button!')
        .images([
            builder.CardImage.create(session, 'http://imgh.us/logo_161.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, website, 'Try it on!')
        ]);
}


function createChoiceCard(session){
	return new builder.HeroCard(session)
        .buttons([
            builder.CardAction.dialogAction(session, 'blueshirt', '', 'Blue Shirt'),
            builder.CardAction.dialogAction(session, 'reddress', '', 'Red Dress'),
            builder.CardAction.dialogAction(session, 'greyshirt', '', 'Grey Shirt')
        ]);
}

function createSocialCard(session){
  return new builder.HeroCard(session)
        .title("Do you want to post your work to your Social Media?")
        .buttons([
            builder.CardAction.dialogAction(session, 'postFB', '', 'Of Course!'),
            builder.CardAction.dialogAction(session, 'finish', '', 'Not Today!')
        ]);
}

function createSketchCard(session){
	return new builder.HeroCard(session)
        .buttons([
            builder.CardAction.dialogAction(session, 'result', '', 'Done Sketch!')
        ]);
}

function createImageCard(session, title, url){
  return new builder.HeroCard(session)
        .title(title)
        .images([
            builder.CardImage.create(session, url)
        ]);
}

function createConceptCard(session){
	var choices = [];
	for (var i = 0; i < concepts.length; i++){
		choices.push( builder.CardAction.dialogAction(session, 'suggest', concepts[i] , concepts[i]) );
	}

	return new builder.HeroCard(session)
        .buttons( choices );
}


function createWordCard(session, title, pictureLink) {
    return new builder.ThumbnailCard(session)
        .buttons([
            builder.CardAction.openUrl(session, pictureLink, title)
        ]);
        
}
function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}


//console.log("Hello");

// Server Init for bot
const server = restify.createServer()
server.listen(process.env.PORT || 8080)
server.post('/', connector.listen())





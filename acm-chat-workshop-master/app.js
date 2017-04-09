const restify = require('restify')
const builder = require('botbuilder')
const config = require('./config.js')
var cognitiveservices = require('botbuilder-cognitiveservices');


//
//    Bot stuff
//

var concepts = ['Car', 'Campfire', 'Windmill', 'Hammer'];

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
intents.matches(/^Hi/i, [
    function(session){
        session.replaceDialog('/');
    }
]);
intents.matches(/^Can I try on some clothing/i, [
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
        session.send("Check it out, you look amazing!");
        //var clothing = results.response.matches(/^Would I look good in a(.*)$/gm);
        //console.log("Hello");
        var clothing = results.response;
        clothing = clothing.replace(/\s/g, '');
        //clothing = clothing.replace(/?/g, '');
        //console.log("World");
        userData.website = "https://www.google.com/".concat(clothing);
        //session.send('%s', website);
        //window.open(website);
        //session.send("google.com/".concat('%s'), clothing);
        //console.log("Yo");
        //session.send("%s", );
        createClothingCard(session)
    }
]);
/*bot.dialog('/answer', (session) =>{
    session.send("Take a look, you look amazing!");
    session.endDialog();
})*/
/*bot.dialog('/third', (session) => {
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
function createClothingCard(session) {
    return new builder.HeroCard(session)
        .title('BotFramework Clothing Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
        /*.images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])*/
        .buttons([
            builder.CardAction.openUrl(session, userData.website, 'Get Started')
        ]);
}


function createChoiceCard(session){
	return new builder.HeroCard(session)
        .buttons([
            builder.CardAction.dialogAction(session, 'ready', '', 'I have an idea!'),
            builder.CardAction.dialogAction(session, 'choice', '', 'Suggest me one!')
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


//console.log("Hello");

// Server Init for bot
const server = restify.createServer()
server.listen(process.env.PORT || 8080)
server.post('/', connector.listen())





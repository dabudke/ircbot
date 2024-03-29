// Setup Settings
const fs = require('fs');
const databases = "./databases/";
// Get raw data
let settingsraw = fs.readFileSync(databases+"settings.json");
let usersraw = fs.readFileSync(databases+"users.json");
let channelsraw = fs.readFileSync(databases+"channels.json");
// Parse raw data
let settings = JSON.parse(settingsraw);
let users = JSON.parse(usersraw);
let channels = JSON.parse(channelsraw);
// Temporary dataset
let temp = {};
console.log('Got databases.')

// Setup IRC.
const irc = require('irc');
const bot = new irc.Client(settings.network, settings.name, [
    realName = settings.realName,
    channels = settings.channels
]);
console.log('Bot created.');
bot.on('registered', () =>{
    console.log('Logged in as '+bot.nick+'.');
    bot._clearWhoisData();
    bot._addWhoisData(settings.whois);
    console.log('Sent WHOIS data.');
    for (let i = 0; i < settings.channels.length; i++) {
        try {
            bot.join(settings.channels[i]);
            console.log('Sucsessfully joined channel '+settings.channels[i]);
        } catch(error) {
            console.log('Error in joining channel: '+settings.channels[i]+"\n"+error);
        };
    }
});

// Join Handler
bot.on('join', (channel, name, msg) => {
    console.log('Received \'join\' event')
    if (name == bot.nick) {
        console.log('Self-triggered, returning.');
        return;
    };
    var uid = users.findIndex(name);
    var cid = channels.findIndex(channel);
    if (users[uid].botop != false && !temporary.registered.botop[temporary.registered.botop.findIndex(name)].registered) {
        if (users[uid].botop == true) {
            bot.notice(name, "You are marked as an operator for this bot, but you do not\
            have a password.  Please use '/msg "+bot.nick+" botop register' with your\
            new password to gain access to botop features.")
        } else {
            bot.notice(name, "You are not logged into botop features.  Please\
            '/msg"+bot.nick+" botop identify' with your password.");
        }
    };
    if (channels[cid].ops.findIndex(nick) > -1) {
        var opid = channels[cid].ops.findIndex(nick);

    } else if (channels[cid].whitelist = true) {
        if (channels[cid].allowed.findIndex(nick) == true) {
            bot.notice(nick, 'Whitelist is enabled for this channel, but you are allowed\
            in.')
        } else {
            bot.say(nick, "You are not whitelisted for this channel.")
            bot.say(channel, "/kick "+nick)
        }
    }
    console.log('Executed \'join\' event.')
});

// Command Handler
bot.on('message', (channel, name, msg) => {
    console.log('Received \'message\' event.');
    if (!msg.startsWith(settings.prefix)) {
        console.log('Message is not a command.  Exiting');
        return;
    };
    var command;
    command.arguments = msg.slice(0, settings.prefix.length);
    command = command.arguments.shift();
    if (command == "botop") {
        bot.say(channel, "Please use this command with '/msg'!");
    } else if (command == "chanop") {
        bot.say(channel, "Please use this command with '/msg'!");
    } else {
        bot.say(channel, "I don't recognize that command.")
    };
    console.log('Executed \'message\' event.');
});

bot.on('nicks', (channel, nicks) => {
    console.log(nicks)
});

// Error handler.
bot.on('error', (error) => {
    console.log("An error occoured:\n"+error)
});
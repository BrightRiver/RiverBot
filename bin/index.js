RiverBot = {};
const tmi = require('tmi.js');
config = require('./config.json');
require('./include');
require('./bootstrap');

const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: config['twitch']['username'],
        password: config["twitch"]["password"]
    },
    channels: config["twitch"]["channels"]
});

client.connect();
RiverBot.client = client;
client.on('message', (channel, tags, message, self) => {
    if (self || !message.startsWith('!')) return;

    RiverBot.input = {
        "channel": channel.replace('#', ''),
        "tags": tags,
        "message": message,
        "self": self
    }

    RiverBot.player = UserUtilities.getOrCreatePlayer(tags);

    let args = message.slice(1).split(' ');
    let command = args.shift().toLowerCase();

    if (typeof RiverBot[command] == 'function') {
        secondsRemaining = RiverBot.player.checkCooldown(command);
        if (secondsRemaining > 0) {
            message = tags['display-name'] + ' looks like !' + command + ' is still on cooldown ' + secondsRemaining + ' seconds remaining';
            RiverBot.client.say(channel, message);
        } else {
            RiverBot[command](channel, tags, message, args);
        }
    }
});


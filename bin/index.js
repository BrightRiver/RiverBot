RiverBot = {};
const tmi = require('tmi.js');
let config = require('./config.json');
require('./include');

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

    RiverBot.log(JSON.stringify(tags));

    let args = message.slice(1).split(' ');
    let command = args.shift().toLowerCase();

    if (typeof RiverBot[command] == 'function') {
        RiverBot[command](channel, tags, message, args);
    }
});


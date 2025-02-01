RiverBot.counters = {};

// counter data structure
/*
    command : {
        count
        display
        lastCount
    }
*/



loadExistingCounters = function () {
    channels = config["twitch"]["channels"];
    channels.forEach(function (channelName) {
        let countersFile = RiverBot.storage[channelName] + '\\counters.json';
        RiverBot.counters[channelName] = {};

        fs.exists(countersFile, function (exists) {
            if (!exists) {
                RiverBot.counters[channelName] = {};
                fs.writeFile(countersFile, JSON.stringify({}), function (err) {
                    if (err) throw err;
                });
            } else {
                //load counters into the riverbot instance
                ChannelCounters = require(countersFile);
                RiverBot.counters[channelName] = ChannelCounters;

                //add commands, one command is enough for every channel using it
                for (const key in ChannelCounters) {
                    if (typeof RiverBot[key] == 'undefined') {
                        RiverBot.commandList.push(key);
                        let command = 'RiverBot["' + key.toLowerCase() + '"] = function(channel, tags, message, args){'
                            + ' if( RiverBot.counters[channel.replace("#", "")]["' + key + '"].lastCount + 10000 > new Date().getTime()) {'
                            + ' return false; '
                            + '} '
                            + ' RiverBot.counters[channel.replace("#", "")].' + key.toLowerCase() + '.count += 1;'
                            + ' RiverBot.counters.sendCounterMessage(channel, "' + key + '");'
                            + ' RiverBot.counters.saveCounters(channel);'
                            + ' }';
                        res = eval(command);
                    }
                }
            }
        });
    });

}

RiverBot.counters.sendCounterMessage = function (channel, counter) {
    let chosenCounter = RiverBot.counters[channel.replace("#", "")][counter]
    let count = chosenCounter.count;

    RiverBot.counters[channel.replace("#", "")][counter].lastCount = new Date().getTime();

    message = chosenCounter.display.replace('count', count);
    RiverBot.client.say(channel, message);
}

RiverBot.counters.saveCounters = function (channel) {
    channelCounters = RiverBot.counters[channel.replace("#", "")];
    countersFile = RiverBot.storage[channel.replace("#", "")] + '\\counters.json';

    fs.writeFile(countersFile, JSON.stringify(channelCounters), function (err) {
        if (err) throw err;
    });
}

RiverBot.addcounter = function (channel, tags, message, args) {
    if (!RiverBot.util.rolecheck('broadcaster', tags)) {
        return false;
    }

    commandName = args[0];


    if (typeof RiverBot.counters[channel.replace("#", "")][commandName] !== 'undefined') {
        RiverBot.client.say(channel, 'that counter already exists');
        return false;
    }

    var countDisplay = message.substr(message.indexOf(" ") + 1);
    var countDisplay = countDisplay.substr(countDisplay.indexOf(" ") + 1);

    // add counter to the channel
    RiverBot.counters[channel.replace("#", "")][commandName] = {
        count: 0,
        display: countDisplay
    }


    // add riverbot command if none already exists
    if (typeof RiverBot[commandName] == 'undefined') {
        //add command to command list
        RiverBot.commandList.push(commandName);
        RiverBot.counters.saveCounters(channel);

        //add command to existing instance
        let command = 'RiverBot["' + commandName.toLowerCase() + '"] = function(channel, tags, message, args){'
            + ' if( RiverBot.counters[channel.replace("#", "")]["' + commandName + '"].lastCount + 10000 > new Date().getTime()) {'
            + ' return false; '
            + '} '
            + ' RiverBot.counters[channel.replace("#", "")].' + commandName.toLowerCase() + '.count += 1;'
            + ' RiverBot.counters.sendCounterMessage(channel, "' + commandName + '");'
            + ' RiverBot.counters.saveCounters();'
            + ' }';
        res = eval(command);

    }
}

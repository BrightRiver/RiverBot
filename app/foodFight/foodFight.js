const fs = require("fs");

let fightcommands = require('./fightCommands.json');

function ff_innit() {
    for (const key in fightcommands) {
        if (fightcommands.hasOwnProperty(key)) {
            if (typeof RiverBot[key] == 'undefined') {
                RiverBot.commandList.push(key);
                message = fightcommands[key]
                let command = 'RiverBot["' + key.toLowerCase() + '"] = function(channel, tags, message, args){;RiverBot.sendFoodFight("' + message + '", channel, tags, args);}'
                res = eval(command);
            }
        }
    }

    RiverBot.sendFoodFight = function (message, channel, tags, args) {
        user = tags['display-name'];
        target = args[0] ?? '';
        message = message.replace('user', user);
        message = message.replace('target', target);
        RiverBot.client.say(channel, message);
    }

    // addFF expected format '{command:string, message:string'}'
    // example user slaps target with fish
    RiverBot.addff = function (channel, tags, message, args) {
        if (!RiverBot.util.rolecheck('mod', tags)) {
            return false;
        }

        commandName = args[0];
        var ffMessage = message.substr(message.indexOf(" ") + 1);
        var ffMessage = ffMessage.substr(ffMessage.indexOf(" ") + 1);

        if (typeof RiverBot[commandName] == 'undefined') {
            //update json file
            fightcommands[commandName] = ffMessage;
            RiverBot.commandList.push(commandName);

            fs.writeFile('./app/foodFight/fightCommands.json', JSON.stringify(fightcommands), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });;
            //add command to existing instance
            let command = 'RiverBot["' + commandName.toLowerCase() + '"] = function(channel, tags, message, args){RiverBot.sendFoodFight("' + ffMessage + '", channel, tags, args);}'
            res = eval(command);

        } else {
            //error command already exists
            RiverBot.client.say(channel, 'a command with that name already exists');
            return false;
        }
    }

    // addFF expected format '{command:string, message:string'}'
    // example user slaps target with fish
    RiverBot.removeff = function (channel, tags, message, args) {
        if (!RiverBot.util.rolecheck('mod', tags)) {
            return false;
        }

        commandName = args[0];
        if (typeof fightcommands[commandName] == 'undefined') {
            RiverBot.client.say(channel, 'No command of that name exists');
            return false;
        } else {
            //update json file
            delete fightcommands[commandName];
            delete RiverBot[commandName];
            RiverBot.commandList.splice(RiverBot.commandList.indexOf(this.commandList), 1);
            fs.writeFile('./app/foodFight/fightCommands.json', JSON.stringify(fightcommands), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });;
            //add command to existing instance
        }


    }
}
ff_innit();
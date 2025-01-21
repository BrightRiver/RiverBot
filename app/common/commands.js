RiverBot.commandList = [];

RiverBot.commands = function () {
    message = RiverBot.commandList.join(', ');
    RiverBot.client.say(RiverBot.input.channel, message);
}

// Add common commands available to all users
RiverBot.commandList.push('balance');
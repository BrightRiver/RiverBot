RiverBot.commandList = [];

RiverBot.commands = function () {
    message = RiverBot.commandList.join(', ');
    RiverBot.client.say(RiverBot.input.channel, message);
}

// Add common commands available to all users
RiverBot.commandList.push('balance');
RiverBot.commandList.push('lurk');
RiverBot.commandList.push('unlurk');
RiverBot.commandList.push('wurk');
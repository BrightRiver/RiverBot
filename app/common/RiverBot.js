RiverBot.raid = function(channel, tags, message, args) {

    if (!RiverBot.util.rolecheck('mod', tags)) {
        return false;
    }

    message = 'Riding in on the River Rapids, ScornedRiver is Raiding!';
    RiverBot.client.say(channel, message);
    RiverBot.player.addCooldown('raid', 300);

}
RiverBot.lurk = function(channel, tags, message, args) {
    message = '@' + tags['display-name'] + ' sat down by the river to drink some tea!';
    RiverBot.client.say(channel, message);
    RiverBot.player.addCooldown('lurk', 300);

}
RiverBot.wurk = function(channel, tags, message, args) {
    message = '@' + tags['display-name'] + ' is fishing in the river while they work...ssshhh dont tell!';
    RiverBot.client.say(channel, message);
    RiverBot.player.addCooldown('wurk', 300);

}
RiverBot.unlurk = function(channel, tags, message, args) {
    message = '@' + tags['display-name'] + ' has returned and is ready to fish in the river';
    RiverBot.client.say(channel, message);
    RiverBot.player.addCooldown('unlurk', 300);

}
 
RiverBot.discord = function(channel, tags, message, args) {        

    if (!RiverBot.util.rolecheck('mod', tags)) {
        return false;
    }

    let link = config.discord.joinlink;
    message = 'Come and chill at the river bank, our discord is open : ' + link;
    RiverBot.client.say(channel, message);

}
RiverBot.balance = function(channel, tags, message, args) {
    let currentBalance = RiverBot.player.balance();
    let res = tags['display-name'] + ' currently has ' + currentBalance + ' RiverCoins in their wallet'
    RiverBot.client.say(channel, res);
}
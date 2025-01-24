RiverBot.roll = function(channel, tags, message, args){
    try {RiverBot.player.spendCoins(50) }
    catch(e) {
        message = '@' + tags['display-name'] + ' looks like you dont have enough coins for that';
        RiverBot.client.say(channel, message);
        return false;
    }
    result = RiverBot.util.random(20);
 // Add username to messages
    if(result == 20) {
        message = 'CRITICAL SUCCESS! You rolled a 20 and struck gold-er water! You found a treasure chest filled with 250 Coins! ';
        value = 250;
    } else if ( result >= 14 ) {
        message = 'The river surges in your favor, showering you with 100 River Coins. Almost legendary!"';
        value = 100;
    } else if ( result >= 6 ) {
        message = 'The river flows steady, returning exactly what you gave. It’s a calm day on the water—try again for a bigger splash!';
        value = 50;
    } else if ( result >= 2 ) {
        message = 'Hard Luck! The river didnt flow in your favour! you get nothing coins!';
        value = 0;
    } else {
        message = 'Hard Luck! The river didnt flow in your favour! have lost half your balance!';
        value = 0 - Math.floor(RiverBot.player.balance()/2);

    }
 
    message = tags['display-name'] + ' Rolled a  ' + result + ' : ' + message;
    RiverBot.client.say(channel, message);
    RiverBot.player.addCoins(value);
    RiverBot.player.addCooldown('roll', 120);


}

RiverBot.commandList.push('roll');
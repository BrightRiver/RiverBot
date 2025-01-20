fishList = require('./fishList.json');

//River bot public commands

RiverBot.fish = function (channel, tags, message, args) {
    let rankValue = RiverBot.util.random(100);
    var RankSelectionObj = false;
    var fishWeight = false;
    var fishRank = false;
    var fishTag = false;
    var fishValue = false;
    var fishName = false;
    for (const key in fishList) {
        if (fishList[key]['resultRange']['min'] <= rankValue && fishList[key]['resultRange']['max'] > rankValue) {
            RankSelectionObj = fishList[key];
            break;
        }
    }
    fishRank = RankSelectionObj['rankDisplay'];
    fishWeight = RiverBot.util.randomBetween(RankSelectionObj['weightRange']['min'], RankSelectionObj['weightRange']['max']);
    fishValue = Math.floor((fishWeight / 1000) * RankSelectionObj['valueMultiplier']);
    fishName = RankSelectionObj['items'][RiverBot.util.random(RankSelectionObj['items'].length)];
    fishTag = RankSelectionObj['tags'][RiverBot.util.random(RankSelectionObj['tags'].length)];

    var ChatMessage = user = tags['display-name'] + ' has cast their line in the river and caught '
        + fishName + ' weighing ' + (fishWeight / 1000).toFixed(2) + 'KG as a '
        + fishRank + ' catch thats ' + fishValue + ' river coins for you.';
    RiverBot.client.say(channel, ChatMessage);
    RiverBot.player.addCoins(fishValue);

}

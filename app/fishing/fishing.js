const LEADERBOARD_DIRECTORY = process.cwd() + '\\leaderboards';
RiverBot.leaderboards = {};
class leaderboard {
    sortDirection = 'DESC' //  descending : DESC, acending : ASC, Custom : CST requires sort and checkValue functions
    sortProperty = 'value' // any numeric property can be used. it must be at the base level of the object
    entries = []; // list of entries, one per user
    channel; // channel leaderboard is connected to
    saveFile;

    addEntry = function (entry, playerId) {
        // determin if entry is better than existing user entry
        let userEnty = this.getEntryForUser(playerId);
        if (userEnty.entry === false) {
            this.entries.push(entry);
        } else {
            let existingValue = userEnty['entry'][this.sortProperty];
            let newValue = entry[this.sortProperty];
            let overwrite = true;

            RiverBot.util.log(existingValue);
            RiverBot.util.log(newValue);

            switch (this.sortDirection) {
                case 'DESC':
                    if (existingValue > newValue) {
                        overwrite = false;
                    }
                    break;
                case 'ASC':
                    if (existingValue < newValue) {
                        overwrite = false;
                    }
                    break;
                case 'CST':
                    if (!this.checkValue(existingValue, newValue)) {
                        overwrite = false;
                    }
                    break;
            }
            if(overwrite) {
                this.entries.splice(userEnty.index, 1);
                this.entries.push(entry);
            }
            
        }

        this.save();
    }

    getSortedArray = function () {
        this.entries.sort(this.sortFunctions[this.sortDirection]);
        let sortedArray = [];
        for (const key in this.entries) {
            sortedArray.push(this.entries[key]['userId']);
        }

        return sortedArray;
    }


    reset = function () {
        this.entries = [];
    }

    sortFunctions = {
        DESC: function (a, b) {
            return b['value'] -  a['value'];
        },
        ASC: function (a, b) {
            return b[this.sortProperty] - a[this.sortProperty];
        }
    }

    getEntryForUser = function (playerId) {
        let entry = false;
        let playerIndex = false;
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i].userId == playerId) {
                entry = this.entries[i];
                playerIndex = i;
            }
        }

        return {
            "entry": entry,
            'index': playerIndex
        }
    }
}



const fs = require("fs");
require("../models/leaderboard");

const FISHING_LEADERBOARD_DIR = LEADERBOARD_DIRECTORY + '\\fishing\\';

RiverBot.leaderboards.fishing = {};

class fishingLeaderboard extends leaderboard {
sortProperty = 'value'
    // entry definition
    /*
         : {
            userId : int twitch user id
            type : 1 of [trash, common, rare, ultra-rare, legendary, mythical]
            fish : name of the fish / item
            weight : weight of fish in grams
            value : value of the fish in river coins
        }
    */

    display = function (playerId) {
        let sortedList = this.getSortedArray();

        let leaderboardText = '';
        let listLength = Math.min(sortedList.length, 10);
        for (let i = 0; i < listLength; i++) {
            let userPosition = i+1;
            let leaderboardEntry = this.getEntryForUser(sortedList[i]);

            leaderboardText += ' | ' + userPosition + '. ' + RiverBot.UserList[this.channel][sortedList[i]].details.displayName + ' ' + leaderboardEntry.entry.type
                + ' ' +leaderboardEntry.entry.fish + ' Worth ' + leaderboardEntry.entry.value + ' RiverCoins';

        }

        RiverBot.client.say(this.channel, leaderboardText);

    }

    loadLeaderboard = function (channel) {
        this.saveFile = RiverBot.storage[RiverBot.input.channel] + '\\fishing.lb.json';
        this.channel = channel;

        // check channel leaderboard exists, if not set leaderboard to empty object
        if (fs.existsSync(this.saveFile)) {
            this.entries = require(this.saveFile);
        }
    }

    save = function () {

        let saveData = JSON.stringify(this.entries);

        fs.writeFile(this.saveFile, saveData, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

}

fishList = require('./fishList.json');

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
    fishName = RankSelectionObj['items'][RiverBot.util.random(RankSelectionObj['items'].length - 1)];
    fishTag = RankSelectionObj['tags'][RiverBot.util.random(RankSelectionObj['tags'].length - 1)];

    var ChatMessage = user = tags['display-name'] + ' has cast their line in the river and caught '
        + fishName + ' weighing ' + (fishWeight / 1000).toFixed(2) + 'KG as a '
        + fishRank + ' catch thats ' + fishValue + ' river coins for you. ' + fishTag;

    RiverBot.client.say(channel, ChatMessage);
    RiverBot.player.addCoins(fishValue);
    RiverBot.player.addCooldown('fish', 60);

    channel = channel.replace('#', '');
    if (typeof RiverBot.leaderboards.fishing[channel] == 'undefined') {
        RiverBot.leaderboards.fishing[channel] = new fishingLeaderboard();
        RiverBot.leaderboards.fishing[channel].loadLeaderboard(channel);
    }
    RiverBot.leaderboards.fishing[channel].addEntry({
        userId: tags['user-id'],
        type: fishRank,
        fish: fishName,
        weight: fishWeight,
        value: fishValue
    },
        tags['user-id']);
}

RiverBot.fishleader = function (channel, tags, message, args) {
    channel = channel.replace('#', '');
    if (typeof RiverBot.leaderboards.fishing[channel] == 'undefined') {
        RiverBot.leaderboards.fishing[channel] = new fishingLeaderboard();
        RiverBot.leaderboards.fishing[channel].loadLeaderboard(channel);
    }
    RiverBot.leaderboards.fishing[channel].display(tags['user-id']);
}

RiverBot.commandList.push('fish');
RiverBot.commandList.push('fishLeader');


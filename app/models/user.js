const userWriteFile = './app/players/{channel}.json';
const userReadFile = '../players/{channel}.json';

class user {
    details = {
        id: '',
        displayName: '',
        title: '',
        hp: 0,
        hpMax: 0
    };
    wallet = {
        "riverCoin": 0
    }
    fishnet = [];
    inventory = [];

    constructor(data, existing = true) {
        // use existing saved data
        if (existing) {
            this.details = data.details;
            this.wallet = data.wallet;
            this.fishnet = data.fishnet;
            this.inventory = data.inventory;

            // create new user from tags
        } else {
            this.details.id = data['user-id'];
            this.details.displayName = data['display-name'];
            this.details.title = 'player';
            this.details.hp = 100;
            this.details.maxHp = 100;
            this.save();
        }
    }


    addCoins = function (amount) {
        this.wallet.riverCoin = this.wallet.riverCoin + amount;
        this.save();
        return true;
    }

    spendCoins = function (amount) {
        if (this.wallet.riverCoin > amount) {
            this.wallet.riverCoin = this.wallet.riverCoin - amount; 
            this.save();
            return true;
        }
        else {
            throw new Error('Insufficent funds');
        }
    }

    balance = function () {
        return this.wallet.riverCoin;
    }

    save = function () {
        let playerData = {
            "details": this.details,
            "wallet": this.wallet,
            "fishnet": this.fishnet,
            "inventory": this.inventory
        };
        let playerId = this.details.id;


        let playerList = require(userReadFile.replace('{channel}', RiverBot.input.channel));
        playerList[playerId] = playerData;
        fs.writeFile(userWriteFile.replace('{channel}', RiverBot.input.channel), JSON.stringify(playerList), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

    }
}

UserUtilities = {
    loadAllUsers: function () {
        channels = config["twitch"]["channels"];
        let users = {};
        channels.forEach(function (channelName) {
            users[channelName] = {};

            fs.exists(userWriteFile.replace('{channel}', channelName), function (exists) {
                console.log(exists);
                if (!exists) {
                    fs.writeFile(userWriteFile.replace('{channel}', channelName), JSON.stringify({}), function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                } else {
                    playerList = require(userReadFile.replace('{channel}', channelName));

                    for (const key in playerList) {
                        users[channelName][key] = new user(playerList[key]);
                    }
                }
            });
        });

        RiverBot.UserList = users;
    },

    getOrCreatePlayer: function (tags) {
        RiverBot.util.log(typeof RiverBot.UserList[RiverBot.input.channel][tags['user-id']]);
        if (typeof RiverBot.UserList[RiverBot.input.channel][tags['user-id']] == 'undefined') {
            RiverBot.util.log('Creating New User : ' + tags['display-name']);
            currentUser = new user(tags, false);
        } else {
            currentUser = RiverBot.UserList[RiverBot.input.channel][tags['user-id']];
        }
        return currentUser;
    }
}
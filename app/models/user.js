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
    cooldowns = {};

    constructor(data, existing = true) {
        // use existing saved data
        if (existing) {
            this.details = data.details;
            this.wallet = data.wallet;
            this.fishnet = data.fishnet;
            this.inventory = data.inventory;

            for (const functionName in data.cooldowns) {
                this.cooldowns[functionName] = RiverBot.util.Cooldown(
                    data.cooldowns[functionName]['functionName']
                    , data.cooldowns[functionName]['duration']
                    , data.cooldowns[functionName]['startTime']
                );
            }

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

    checkCooldown = function (command) {
        if (this.cooldowns[command]) {
            if (this.cooldowns[command].active()) {
                return this.cooldowns[command].remaining();
            }
        }
        return false;
    }

    addCooldown = function (command, duration) {
        this.cooldowns[command] = RiverBot.util.Cooldown(command, duration);
        this.save();
    }

    save = function () {
        let playerData = {
            "details": this.details,
            "wallet": this.wallet,
            "fishnet": this.fishnet,
            "inventory": this.inventory,
            "cooldowns": this.cooldowns
        };
        let playerId = this.details.id;

        let userFile = RiverBot.storage[RiverBot.input.channel] + '\\users.json';

        let playerList = require(userFile);
        playerList[playerId] = playerData;
        fs.writeFile(userFile, JSON.stringify(playerList), function (err) {
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
            let userFile = RiverBot.storage[channelName] + '\\users.json';
            users[channelName] = {};

            fs.exists(userFile, function (exists) {
                console.log(exists);
                if (!exists) {
                    fs.writeFile(userFile, JSON.stringify({}), function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                } else {
                    playerList = require(userFile);

                    for (const key in playerList) {
                        users[channelName][key] = new user(playerList[key]);
                    }
                }
            });
        });

        RiverBot.UserList = users;
    },

    getOrCreatePlayer: function (tags) {
        if (typeof RiverBot.UserList[RiverBot.input.channel][tags['user-id']] == 'undefined') {
            RiverBot.util.log('Creating New User : ' + tags['display-name']);
            currentUser = new user(tags, false);
            currentUser.save();
            RiverBot.UserList[RiverBot.input.channel][tags['user-id']] = currentUser;
        } else {
            currentUser = RiverBot.UserList[RiverBot.input.channel][tags['user-id']];
        }
        return currentUser;
    }
}
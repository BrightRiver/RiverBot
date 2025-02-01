var cwd = process.cwd();

RiverBot.storage = {};
for (var i = 0; i < config["twitch"]["channels"].length; i++) {
    let channel = config["twitch"]["channels"][i];
    let storageLocation = cwd + '\\storage\\' + channel;
    if (!fs.existsSync(storageLocation)) {
        fs.mkdir(storageLocation, (err) => {
            if (err) {
                return console.error(err);
            }
            RiverBot.util.log('Channel storage created!');
        });
    }
    RiverBot.storage[channel] = storageLocation;
}

UserUtilities.loadAllUsers();
loadExistingCounters();

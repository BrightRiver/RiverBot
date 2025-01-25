const LEADERBOARD_DIRECTORY = process.cwd() + '\\leaderboards';
RiverBot.leaderboards = {};
class leaderboard {
    sortDirection = 'DESC' //  descending : DESC, acending : ASC, Custom : CST requires sort and checkValue functions
    sortProperty = 'value' // any numeric property can be used. it must be at the base level of the object
    entries = {}; // list of entries, one per user
    channel; // channel leaderboard is connected to
    saveFile;

    addEnty = function (entry, playerid) {
        // determin if entry is better than existing user entry
        if (typeof entries[playerid] != 'undefined') {
            existingValue = this.entires[playerid][this.sortProperty];
            newValue = entry[this.sortProperty];
            switch (this.sortDirection) {
                case 'DESC':
                    if (existingValue > newValue) {
                        return false;
                    }
                    break;
                case 'ASC':
                    if (existingValue < newValue) {
                        return false;
                    }
                    break;
                case 'CST':
                    if (!this.checkValue(existingValue, newValue)) {
                        return false;
                    }
                    break;
            }

        }
        this.entries[this.playerid] = entry;
        this.save();
    }

    getSortedArray = function () {
        this.entires.sort(this.sortFunctions[this.sortDirection]);
        sortedArray = [];
        for (const key in this.entires) {
            sortedArray.push(key);
        }

        return sortedArray;
    }


    reset = function () {
        this.entires = {};
    }

    sortFunctions = {
        DESC: function (a, b) {
            return a[this.sortProperty] - b[this.sortProperty];
        },
        ASC: function (a, b) {
            return b[this.sortProperty] - a[this.sortProperty];
        }
    }
}


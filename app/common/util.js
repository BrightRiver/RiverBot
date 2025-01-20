const logfile = './logs/riverLog.log';

RiverBot.util = {

    "rolecheck": function (targetRole, tags) {
        let accepctedRoles = ['broadcaster', 'mod', 'subscriber', 'user'];
        if (!accepctedRoles.includes(targetRole)) {
            RiverBot.util.log('Target role ' + targetRole + 'does not exist');
            return false;
        }

        let role = 'user';

        if (tags['badges-raw'].includes('broadcaster')) {
            role = 'broadcaster';
        } else if (tags['mod']) {
            role = 'mod'
        } else if (tags['subscriber']) {
            role = 'subscriber';
        }

        if (accepctedRoles.indexOf(role) <= accepctedRoles.indexOf(targetRole)) {
            return true;
        }
        return false;
    },

    "coinflip": function () {
       let number = Math.floor(Math.random() * 2);
       if(number == 1) {
        return 'heads';
       }
       return 'tails';
    },

    "random": function (max) {
        let number = Math.floor(Math.random() * (max + 1));
        return number;
    },

    
    "randomBetween": function (min, max) {
        range = max - min;
        let number = Math.floor(Math.random() * (range + 1));
        result = number + min;
        return result;
    },

    "log" : function( logMessage ) {
        let date = new Date();
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          };
          
          timestamp = date.toLocaleDateString('en-GB', options);
          if(typeof logMessage == 'object') {
            logMessage = JSON.stringify(logMessage);
          }
    
        let messageString = timestamp + ' : ' + logMessage + '\n';
        fs.appendFile(logfile,messageString,(err) => {
            if (err) throw err;
        });
}

}
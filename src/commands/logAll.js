const fs = module.require('fs');

module.exports.run = async ( client, message, args ) => {
    
    fs.readFile("./records.json", 'utf8', (err, data) => {
        let loaded = JSON.parse(data);
        if (loaded.players === undefined){
            message.channel.send(`No logs to report!`);
        }
        for ( player in loaded.players ) {
            console.log(player);
            let allReasons = [];
            for ( item in loaded.players[player].reloads ) {
                allReasons.push(loaded.players[player].reloads[item]);
            }
            message.channel.send(`Reasons ${loaded.players[player].name} reloaded: ${allReasons.join(", ")}`);
        }
    });
}

module.exports.help = {
    name: "logAll"
}
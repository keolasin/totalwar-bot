const fs = module.require('fs');

module.exports.run = async ( client, message, args ) => {
    let dataObject = {};
    let reason = args.join(" ");
    let owner = message.author.id;
    let reloadCount = 0;
    
    fs.readFile("./records.json", 'utf8', (err, data) => {
        if (err) throw error;
        let readData = JSON.parse(data);
        if (readData.players === undefined) { // no existing data
            dataObject.players = [];
            dataObject.players.push({ 
                id: message.author.id, 
                name: message.author.username,
                reloads: [ reason ]
            });
            reloadCount++;
            
            fs.writeFile("./records.json", JSON.stringify(dataObject), err => {
                if (err) throw err;
                message.channel.send(`Welcome, ${message.author.username}! Reloading because ${reason || 'no reason'}, total is now ${dataObject.players[0].reloads.length}!`);
                return;
            });
            return;
        }
        dataObject = readData; // temporary data storage obj
        for ( player in readData.players ) { // loop through all players in the dataset
            if (readData.players[player].id === owner){ // find the player, update their reloads
                dataObject.players[player].reloads.push(reason);
                reloadCount = dataObject.players[player].reloads.length;

                fs.writeFile("./records.json", JSON.stringify(dataObject), err => {
                    if (err) throw err;
                    message.channel.send(`Another reload for ${message.author.username} because ${reason || 'no reason'}, total is now ${reloadCount}!`);
                    return;
                });
                return;
            }
        }
        
        dataObject.players.push({
            id: message.author.id,
            name: message.author.username,
            reloads: [ reason ]
        });
        
        fs.writeFile("./records.json", JSON.stringify(dataObject), err => {
            if (err) throw err;
            message.channel.send(`Welcome ${message.author.username}! You've reloaded because ${reason}, total is now ${reloadCount+1}!`);
            return;
        });
    });
}

module.exports.help = {
    name: "addLoad"
}
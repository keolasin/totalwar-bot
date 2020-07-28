const fs = module.require('fs');

module.exports = {
    addReload( client, message, args ){
        fs.writeFile("./records.json", JSON.stringify(), err => {
            if (err) throw err;
            message.channel.send(`Recorded the reload for ${message.author}`);
        })
    }
}

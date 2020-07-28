const fs = module.require('fs');

module.exports.run = async ( client, message, args ) => {

    fs.readFile("./records.json", (data, err) => {
        if (err) throw err;
    });

    fs.writeFile("./records.json", JSON.stringify(message.author), err => {
        if (err) throw err;
        message.channel.send(`Recorded the reload for ${message.author}`);
    });
}

module.exports.help = {
    name: "addReload"
}
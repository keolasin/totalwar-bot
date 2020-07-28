require('dotenv').config();
const fs = require('fs');

const { Client, Collection } = require('discord.js');
const client = new Client();
client.commands = new Collection();
client.ratelimits = new Collection();
client.records = require('./records.json');

// grab all the commands from the src/commands folder
fs.readdir("./src/commands/", (err, files) => {
	if (err) {
        console.error(err);
    }

	let jsFiles = files.filter(f => f.split(".").pop() === "js");

	if (jsFiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}

	console.log(`Loading ${jsFiles.length} commands!`);

	jsFiles.forEach((file, index) => {
		let props = require(`./src/commands/${file}`);
		console.log(`${index + 1}: ${file} loaded!`);
		client.commands.set(props.help.name, props);
	});
});

client.on('ready', () => {
    console.log(`Ready, logged in as ${client.user.tag}!`);
});

const prefix = '!';

client.on('message', message => {
    if ( message.author.bot ) return;
    if ( message.channel.type === "dm" ) return;
    if ( !message.content.startsWith(prefix) ) return; // return out if the prefix isn't used at the message start
    
    const commandBody = message.content.slice(prefix.length); // command string without prefix
    const arguments = commandBody.split(' ');
    const command = arguments.shift().toLowerCase();
    let limit = client.ratelimits.get(message.author.id);

    if (command === 'reload'){
        const timeReloaded = message.createdTimeStamp;
        addReload( client, message, arguments );
    }
});

client.login(process.env.BOT_TOKEN);
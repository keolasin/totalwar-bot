require('dotenv').config();
const fs = require('fs');

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
	process.env.DATABASE_URL, 
	process.env.DATABASE_USERNAME,
	process.env.DATABASE_PW, 
	{
		dialect: 'postgres',
	}
);

sequelize.authenticate().then(() => {
	console.log("Database connected successfully.");
}).catch((err) => {
	console.log(err);
});

const { Client, Collection } = require('discord.js');
const client = new Client();
client.commands = new Collection();
client.ratelimits = new Collection();
client.records = require('./records.json');

// command prefix
const prefix = '!';

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

client.on('message', message => {
    if ( message.author.bot ) return;
    if ( message.channel.type === "dm" ) return;
    if ( !message.content.startsWith(prefix) ) return; // return out if the prefix isn't used at the message start
    
    // parse the message into command and arguments
    const commandBody = message.content.split(/\s+/g);
    const command = commandBody[0];
    const arguments = commandBody.slice(1);
    
    // setup rate limiting for spammers
    let limit = client.ratelimits.get(message.author.id);
    let now = Date.now();
	let timeLimit = 2000;

	if( limit != null) {
		if( limit >= now - timeLimit) {
			message.delete();
			return message.channel.send("You are being ratelimited. Try again in `" + (Math.abs((now - limit) - timeLimit) / 1000).toFixed(2) + "` seconds.").then(m => m.delete(2000));
		} else {
			client.ratelimits.set(message.author.id, now);
		}
	} else {
		client.ratelimits.set(message.author.id, now);
	}

    // command handling
    let runCommand = client.commands.get(command.slice(prefix.length));
    if ( command ) {
        console.log(`Running command: ${command}`)
        runCommand.run(client, message, arguments);
    }
});

client.login(process.env.BOT_TOKEN);
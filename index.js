require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();
const { addReload } = require("./src/commands/add-reload.js");

client.on('ready', () => {
    console.log(`Ready, logged in as ${client.user.tag}!`);
});

const prefix = '!';

client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(prefix)) return; // return out if the prefix isn't used at the message start
    
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
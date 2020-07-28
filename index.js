require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
    console.log(`Ready, logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);
require('dotenv').config();

const Discord = require('discord.js');
const client = new Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);
const fs = require('fs');
const Discord = require('discord.js')
const config = require('./config.json');
const { prefix, token } = require('./config.json');
const client = new Discord.Client()
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));



//Include Command Files ending in .ts
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Runs once at startup
client.on('ready', () => {

    // Sets Bot Status
    console.log("Connected as " + client.user.tag + ", yo it works")
    client.user.setActivity(`${prefix}help`, {type: "PLAYING"})


});

//Runs when a member joins a guild(server)
client.on('guildMemberAdd', join => {

  //you can use this to assign a member role when a user joins or something

});


client.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
  	return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
	  message.reply(`\**Crashlog:\** ${error}`);
  }


});

client.login(token)


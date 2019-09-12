const blessed = require('blessed');
const Discord = require('discord.js');
const client = new Discord.Client();

const token = '';

var screen = blessed.screen({
  smartCSR: true,
  dockBorders: true,
});

screen.key(['q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

function guildCallback(guild) {
  channelMenu.setItems([]);
  channelMenuArray = [];
  guild.channels.forEach( function(channel) {
    channelMenu.add(channel.name);
    channelMenuArray.push(channel);
    });
  channelMenu.focus();
  screen.render();
}

var chatMenu = blessed.List({
  left: '10%-1',
  top: '5%-1',
  keys: true,
  border: 'line',
});

var guildsMenu = blessed.Listbar({
  height : '5%',
  //left: '10%',
  keys: true,
  border: 'line',
  style : {
    fg: 'white',
    //bg: 'magenta',
    border: {
      fg: '#ffffff'
    },
    selected: {
      bg: 'green'
    }
  },

}
);


// guildsMenu.key('left', () => {
//   guildsMenu.moveLeft(1);
//   screen.render();
// });

var channelMenu = blessed.List({
  parent: guildsMenu,
  keys: true,
  top: '5%-1',
  width: '10%',
  border: 'line',
  style : {
    fg: 'white',
    //bg: 'magenta',
    border: {
      fg: '#ffffff'
    },
    selected: {
      bg: 'green'
    }
  },
});

var channelMenuArray = [];

// guildsMenu.key('right', () => {
//   guildsMenu.moveRight(1);
//   screen.render();
// });

function appendGuild(guild) {
  guildsMenu.add(guild.name, () => {guildCallback(guild)});
}

function findGuild(name) {
  for (var i = 0; i < client.guilds.length; i++) {
   if (client.guilds[i].name == name) {
     return i;
   }
 }   return None;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.forEach(appendGuild);
  screen.render();
});

channelMenu.on('select', () => {
  channelMenuArray[channelMenu.selected].fetchMessages({limit:20})
  .then(messages => {messages.forEach( function(msg) {chatMenu.add(msg.author.username+' | '+msg.content)})});
  screen.render();
});

channelMenu.key('escape', () => {guildsMenu.focus();});

screen.append(guildsMenu);
screen.append(channelMenu);
screen.append(chatMenu);


screen.render();
guildsMenu.focus();

client.login(token);

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


var guildsMenu = blessed.Listbar({
  height : '5%',
  keys: true,
  border: 'line',
  style : {
    fg: 'white',
    border: {fg: '#ffffff'},
    selected: {bg: 'green'}
  },
});


//make pretty
function guildCallback(guild) {
  channelMenu.setItems([]);
  channelMenuArray = [];
  var sortedChannels = guild.channels.sort((a, b) => a.position - b.position);
  sortedChannels.forEach( function(channel) {
    if (channel.type == 'category'){
      channelMenu.add('>'+channel.name);
    }else{
      channelMenu.add(channel.name);
    }
    channelMenuArray.push(channel);
    });
  channelMenu.focus();
  //console.log(guild.channels);
  screen.render();
}

function appendGuild(guild) {
  guildsMenu.add(guild.name, () => {guildCallback(guild)});
}


var chatMenu = blessed.List({
  left: '10%-1',
  top: '5%-1',
  keys: true,
  border: 'line',
  style : {
    fg: 'white',
    border: {fg: '#ffffff'},
    selected: {bg: 'green'}
  },
});


var channelMenu = blessed.List({
  keys: true,
  top: '5%-1',
  width: '10%',
  border: 'line',
  style : {
    fg: 'white',
    border: {fg: '#ffffff'},
    selected: {bg: 'green'}
  },
});

var channelMenuArray = [];

function formatChannels(channels) {
  var stringArray = [];
  channels.sort((a, b) => parseFloat(a.position) - parseFloat(b.position));
  //console.log(channels);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.forEach(appendGuild);
  screen.render();
});

function appendChat(messages) {
  messages.forEach( message => {
    chatMenu.add(message.content);
  });
  chatMenu.focus();
  screen.render();
}

channelMenu.on('select', () => {
  chatMenu.setItems([]);
  channelMenuArray[channelMenu.selected].fetchMessages({ limit: 50 })
  .then(messages => appendChat(messages))
  .catch(console.error);
  screen.render();
});

channelMenu.key('escape', () => {guildsMenu.focus();});
chatMenu.key('escape', () => {channelMenu.focus();});

screen.append(guildsMenu);
screen.append(channelMenu);
screen.append(chatMenu);


screen.render();
guildsMenu.focus();

client.login(token);


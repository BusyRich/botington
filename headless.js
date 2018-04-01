const path = require('path'),
      url = require('url'),
      Botington = require(__dirname + '/lib/' + 'bot'),
      config = require(__dirname + '/config.json');

const bot = Botington(config);

bot.on('channel', function(data) {
  console.log('Connected to Channel #%s', data.channel);
});

bot.on('join', function(data) {
  console.log('%s has joined the chat!', data.username);
  console.log(bot.chatters.size);
});

bot.on('leave', function(data) {
  console.log('%s has left the chat. :(', data.username);
  console.log(bot.chatters.size);
});

bot.on('message', function(data) {
  console.log(data);
});

bot.on('command', function(data) {
  console.log(data);
});

bot.on('names', function(data) {
  console.log(data.users);
  console.log(bot.chatters.size);
});

bot.on('ready', () => {
});

bot.initialize();
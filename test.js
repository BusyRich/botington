const path = require('path'),
      url = require('url'),
      Botington = require(__dirname + '/lib/' + 'bot');

const bot = new Botington(path.join(__dirname, '/../'));

bot.on('channel', function(data) {
  console.log('Connected to Channel #%s', data.channel);
});

bot.on('join', function(data) {
  console.log('%s has joined the chat!', data.username);
  console.log(bot.chatters.size);
});

bot.on('part', function(data) {
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

bot.on('refresh', () => {
});

bot.registerCommand('butt', function(meta, ...args) {
  bot.pm(meta.username, `I just wanted to let you know...butt, with ${args.length} arguments.`);
});

bot.initialize();
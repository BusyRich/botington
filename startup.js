const {app, BrowserWindow} = require('electron');

const path = require('path'),
      url = require('url'),
      Botington = require(__dirname + '/lib/' + 'bot'),
      config = require(__dirname + '/config.json');

let win;
const createWindow = () => {

  console.log(path.join(__dirname, 'assets', 'icons', '64x64.png'));
  // Create the browser window.
  const win = new BrowserWindow({
          width: 1024,
          height: 768,
          icon: path.join(__dirname, 'assets', 'icons', '64x64.png')
        }),
        bot = Botington(config);

  win.bot = bot;

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'UI', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  bot.on('message', data => win.webContents.send('chat-message', data));

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
};

app.on('ready', createWindow);

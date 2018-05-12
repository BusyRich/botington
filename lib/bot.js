const path = require('path'),
      _ = require('lodash'),
      BotBase = require('BotBase'),
      IRC = require(path.join(__dirname, 'irc')),
      PluginManager = require(path.join(__dirname, 'plugin_manager')),
      Timer = require(path.join(__dirname, 'timer')),
      EventEmitter = require('events');

const Bot = function(botPath) {
  //make a copy of the config so we don't modify the one given
  this.config = Object.assign({}, require(path.join(botPath, 'config.json')));
  this.event = new EventEmitter();
  this.pluginManager = PluginManager();
  this.db = BotBase.connect(this.config.database, error => {
    console.log('Database Connected.');
    this.event.emit('database', error);
  });

  //The IRC connection for the bot
  this.botIRC = IRC(this.config['bot-user'],
    this.config['bot-oauth'], this.config['channels']);

  this.uptime = 0;
  this.chatters = new Set();
  this.commands = {};
  this.pluginManager = PluginManager();
  this.plugins = this.pluginManager.plugins;
  this.initialized = false;

  this.db.dataTypes = BotBase.type;

  this.db.members = this.db.model('members', {
    username:  this.db.dataTypes.TEXT,
    age: this.db.dataTypes.INT,
    lastping: this.db.dataTypes.INT
  });

  //Keep the path to the plugin so paths provided can be
  //relative to it.
  this.config.path = botPath;

  //Lowercasing the config usernames allows for easier comparing later
  this.config['bot-user'] = this.config['bot-user'].toLowerCase();
  for(let c = 0; c < this.config.channels.length; c++) {
    this.config.channels[c] = this.config.channels[c].toLowerCase();
  }

  //Add a helper function for updating all the current chatters
  this.db.members.updateChatters = (updates, callback) => {
    this.db.members.updateOrCreateMany({
      attribute: 'username',
      values: [...this.chatters],
      update: updates
    }, callback);
  };

  //Helper function to get a member by username
  this.db.members.single = (username, callback) => {
    this.db.members.readOrCreate({username:username}, {
      lastPing: Date.now(),
      age: 1
    }, (error, member) => callback(error, (member ? member : null)));
  };

  //Callback for updating member pings, so it is not created every refresh
  const onPingsUpdated = error => {
    console.log(error || 'Member Pings Updated');
    this.event.emit('refresh');
  };

  //Minute interval refresh cycle
  setInterval(() => {
    this.uptime++;
    this.db.members.updateChatters({
      $set: {lastPing:Date.now()},
      $inc: {age:1}
    }, onPingsUpdated);
  }, 60000);

  //Convience function that adds chatters to the set
  const addChatters = (newChatters) => {
    for(let c = 0; c < newChatters.length; c++) {
      this.chatters.add(newChatters[c]);
    }
  };

  this.botIRC.on('channel', data => {
    this.event.emit('ready');
  });
  this.botIRC.on('join', data => addChatters([data.username]));
  this.botIRC.on('names', data => addChatters(data.users));
  this.botIRC.on('part', data => _.pull(this.chatters, data.username));
  this.botIRC.on('message', data => addChatters([data.username]));

  this.botIRC.on('command', data => {
    addChatters([data.username]);
    this.botIRC.emit('before-command', data);
    this.runCommand(data.command, data, data.arguments);
    this.botIRC.emit('after-command', data);
  });
};

/*
 * Database Connect -> Load Plugins -> Start Chat Connection
 */
Bot.prototype.initialize = function() {
  if(this.initialized) {
    return;
  }

  const start = () => {
    this.botIRC.connect();
    this.initialized = true;
  };

  const loadPlugins = () => {
    if(!this.config['plugins-disabled']) {
      this.pluginManager.on('ready', start);
      this.pluginManager.load(this);
    } else {
      start();
    }
  };

  if(this.db.connected) {
    loadPlugins();
  } else {
    this.on('database', loadPlugins);
  }
};

Bot.prototype.on = function(eventType, handler) {
  //ready and refresh are coming from the bot, everything else
  //comes from the bots IRC listener. Also, we don't want to 
  //expose data or connect events from the IRC listener
  if(Bot.botEvents.indexOf(eventType) >= 0) {
    this.event.on(eventType, handler);
  } else if(eventType != 'data' && eventType != 'connect') { 
    this.botIRC.on(eventType, handler);
  }
};

Bot.prototype.off = function(eventType, handler) {
  if(Bot.botEvents.indexOf(eventType) >= 0) {
    this.event.removeListener(eventType, handler);
  } else if(eventType != 'data' && eventType != 'connect') { 
    this.botIRC.off(eventType, handler);
  }
};

Bot.prototype.registerCommand = function(command, handler) {
  if(command && handler) {
    if(!this.commands.hasOwnProperty(command)) {
      this.commands[command] = handler;
    } else {
      this.event.emit('error', `Command ${command} has already been registerd`);
    }
  }
};

Bot.prototype.runCommand = function(command, meta, args) {
  if(this.commands.hasOwnProperty(command)) {
    this.commands[command].call(
      this.commands[command], meta, ...args);
  }
};

//Messaging Functions
Bot.prototype.send = function(message, channel) {
  this.botIRC.send('PRIVMSG', 
    `#${(channel || this.config.channels[0])}`, `:${message}`);
};

Bot.prototype.sendf = function(message, channel, ...data) {
  this.send(this.format(message, ...data), channel);
};

Bot.prototype.pm = function(username, message, channel) {
  this.send(`/w ${username} ${message}`, channel);
};

Bot.prototype.pmf = function(username, message, channel, ...data) {
  this.pm(username, this.format(message, ...data), channel);
};

Bot.prototype.format = function(text, ...data) {
  let str = text;
  if (str && data.length) {
    let args = data.length > 1 ? data : data[0],
        matches = str.match(Bot.formatCapture);

    for(let m in matches) {
      let replacement = matches[m].slice(1, -1),
          value;
          
      if(replacement.indexOf('.') > -1) {
        replacement = replacement.split('.');
        
        for(let p in replacement) {
          value = (p == 0 ? args[replacement[p]] : value[replacement[p]]) || matches[m];
        }
      } else {
        value = args[replacement];
      }
      
      if(value != undefined && value != null) {
        str = str.replace(matches[m], value);
      }
    }
  }

  return str;
};

Bot.prototype.getTimer = function(minutes, singleUse) {
  return new Timer(minutes, singleUse);
};

Bot.formatCapture = /({[a-z0-9\.]+})/gi;
Bot.botEvents = ['ready', 'refresh', 'database'];

module.exports = function(configPath) {
  return new Bot(configPath);
};
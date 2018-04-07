const path = require('path'),
      _ = require('lodash'),
      DB = require(path.join(__dirname, 'data', 'data_manager')),
      IRC = require(path.join(__dirname, 'irc')),
      PluginManager = require(path.join(__dirname, 'plugin_manager')),
      RegisterBasicCommands = require(path.join(__dirname, 'commands')),
      EventEmitter = require('events');

const Bot = configuration => {
  const config = Object.assign({}, configuration), //make a copy of the config
        event = new EventEmitter(),
        chatters = new Set(),
        commands = {},
        db = DB(config),
        irc = IRC(config),
        pluginManager = PluginManager();
  
  let connections = 0,
      initialized = false;

  //Lowercasing the config usernames allows for easier comparing later
  config['bot-username'] = config['bot-username'].toLowerCase();
  for(let c = 0; c < config.channels.length; c++) {
    config.channels[c] = config.channels[c].toLowerCase();
  }

  const addChatters = (...newChatters) => {
    for(let c = 0; c < newChatters.length; c++) {
      chatters.add(newChatters[c]);
    }
  };

  const updateAllChatters = (updates, callback) => {
    db.updateMembers([...chatters], updates, callback);
  };

  const pingsUpdated = function(error) {
    console.log(error || 'Member Pings Updated');
    event.emit('refresh');
  };

  const refresh = () => {
    //Update the ping and age of currently connected members
    updateAllChatters({
        $set: {lastPing:Date.now()},
        $inc: {age:1}
      }, pingsUpdated);
  };

  //Minute interval refresh cycle
  setInterval(refresh, 60000);

  const runCommand = function(command, meta, ...args) {
    if(commands.hasOwnProperty(command)) {
      commands[command].call(commands[command], meta, ...args);
    }
  };

  irc.on('channel', data => {
    connections++;
    if(connections == config.channels.length) {
      event.emit('ready');
    }
  });
  irc.on('join', data => addChatters(data.username));
  irc.on('names', data => addChatters.apply(addChatters, data.users));
  irc.on('part', data => _.pull(chatters, data.username));
  irc.on('command', data => {
    irc.emit('before-command', data);
    runCommand(data.command, data, ...data.arguments);
    irc.emit('after-command', data);
  });

  //We must wait for the plugins to be loaded before
  //starting up the IRC listener
  pluginManager.on('ready', () => {
    RegisterBasicCommands(this);
    irc.connect();
  });

  return Object.assign(this, {
    initialized,
    plugins: pluginManager.plugins,
    config: config,
    chatters: chatters,
    on: (eventType, handler) => {
      //ready and refresh are coming from the bot, everything else
      //comes from the bots IRC listener. Also, we don't want to 
      //expose data or connect events from the IRC listener
      if(eventType === 'ready' || eventType === 'refresh') {
        event.on(eventType, handler);
      } else if(eventType != 'data' && eventType != 'connect') { 
        irc.on(eventType, handler);
      }
    },
    off: (eventType, handler) => {
      if(eventType === 'ready' || eventType === 'refresh') {
        event.removeListener(eventType, handler);
      } else if(eventType != 'data' && eventType != 'connect') { 
        irc.off(eventType, handler);
      }
    },
    db: db,
    initialize: () => {
      //Prevents the init from running multiple times
      if(this.initialized) {
        return;
      }

      pluginManager.load(this);
      this.initialized = true;
    },
    send: (message, channel) => {
      irc.send('PRIVMSG', `#${(channel || config.channels[0])}`, `:${message}`);
    },
    sendf: (message, channel, ...data) => {
      this.send(this.format(message, ...data), channel);
    },
    registerCommand: (command, handler) => {
      if(command && handler) {
        if(!commands.hasOwnProperty(command)) {
          commands[command] = handler;
        } else {
          event.emit('error', `Command ${command} has already been registerd`);
        }
      }
    },
    runCommand,
    updateAllChatters,
    //Simple text formatting function
    format: (text, ...data) => {
      let str = text;
      if (str && data.length) {
        let args = (data.length > 1 ? data : data[0]);

        for(let key in args) {
          str = str.replace(new RegExp(`\\{${key}\\}`, 'gi'), args[key]);
        }
      }
  
      return str;
    }
  });
};

module.exports = Bot;
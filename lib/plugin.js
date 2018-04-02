const path = require('path'),
      _ = require('lodash'),
      EventEmitter = require('events');

module.exports = function(config, bot) {
  this.config = config;
  this.bot = bot;
  this.db = bot.db;
  this.event = new EventEmitter();
  this.name = config.name;
  this.version = config.version;
  this.unmetDependencies = [];
  this.messages = config.messages || {};
  this.settings = config['default-settings'] || {};
  this.dev = config['dev-mode'] || false;
  this.enabled = config['enabled'] || false;

  const setEnabled = () => {
    if(this.config.dependencies && this.config.dependencies.length) {
      for(let d = 0; d < this.config.dependencies.length; d++) {
        if(!bot.plugins[this.config.dependencies[d]] || 
          !bot.plugins[this.config.dependencies[d]].enabled)
        {
          this.unmetDependencies.push(config.dependencies[d]);
        }
      }
    }

    if(this.unmetDependencies.length) {
      this.enabled = false;
    }
  };
  
  this.ready = handler => {
    if(this.dev) {
      setEnabled();
      handler();
    } else {
      this.event.on('ready', handler);
    }
  };

  this.registerCommand = (command, handler) => {
    this.bot.registerCommand(command, (...args) => {
      //Prevents plugins from running commands when
      //they are disabled.
      if(!this.enabled) {
        return;
      }

      handler.apply(handler, args);
    });
  };

  this.sendm = (messageKey, data, channel) => { //send message
    this.bot.sendf(plugin.messages[messageKey], channel, data);
  };

  //This allows us to obfuscate some fancy context binding we have to 
  //do for plugins, IE makes it so plugin developers don't have to
  //worry about that.
  this.bind = (context, methods) => {
    return Object.assign(context, this, methods);
  }

  const loaded = error => {
    if(error) {
      this.event.emit('error', error);
    }

    setEnabled();
    this.event.emit('ready');
  };

  const update = callback => {
    this.db.update('plugins', {name:this.name},{$set: {
      version: this.version,
      settings: this.settings,
      messages: this.messages
    }}, callback);
  };

  if(!this.dev) {
    //Get the plugin from the DB or create the record
    //for a brand new plugin
    this.db.getOrCreate('plugins', 
      {name:this.name}, {
        version: this.version,
        settings: this.settings,
        messages: this.messages
      }, (error, result) => {
        if(error) {
          return loaded(error);
        }

        if(result.value) {
          //Settings and Messages cannot be overridden by configs
          //since users can change them. The lodash defaults function
          //allow us to keep any data the user set while supporting new
          //entries provided by new versions of the plugin.
          this.settings = _.defaults({}, 
            result.value.settings, this.settings);

          this.messages = _.defaults({}, 
            result.value.messages, this.messages);

          if(result.value.version != this.version) {
            return update(loaded);
          }
        }

        loaded();
      });
  }
  
  //Combine the base plugin object with the specific plugin instance
  return Object.assign(require(path.join(this.config.main))(this), {
    ready: this.ready
  });
};
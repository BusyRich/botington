const path = require('path'),
      _ = require('lodash'),
      EventEmitter = require('events');

const checkDependencies = function(dependencies, plugins) {
  let unmetDependencies = [];

  if(dependencies && dependencies.length) {
    for(let d = 0; d < dependencies.length; d++) {
      if(!plugins[dependencies[d]] || 
        !plugins[dependencies[d]].enabled)
      {
        unmetDependencies.push(dependencies[d]);
      }
    }
  }

  return unmetDependencies;
};

const Plugin = function(config, bot) {
  this.config = config;
  this.bot = bot;
  this.db = bot.db;
  this.event = new EventEmitter();
  this.name = config.name;
  this.version = config.version;
  this.messages = config.messages || {};
  this.settings = config['default-settings'] || {};
  this.dev = config['dev-mode'] || false;
  this.enabled = config['enabled'] || false;

  this.on = this.event.on.bind(this.event);

  this.unmetDependencies = checkDependencies(
    this.config.dependencies, this.bot.plugins);

  this.setEnabled();
};

//This makes sure a plugin is not enabled
//when its dependencies are not enabled
Plugin.prototype.setEnabled = function() {
  if(this.unmetDependencies.length) {
    this.enabled = false;
  }
};

Plugin.prototype.load = function() {
  if(this.dev) {
    return this.event.emit('loaded', this);
  }

  this.db.getOrCreate('plugins', 
    {name:this.name}, {
      version: this.version,
      settings: this.settings,
      messages: this.messages
    }, (error, result) => {
      if(error) {
        return this.event.emit('error', error);
      }

      this.setEnabled();

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
          return update(() => {
            this.event.emit('loaded', this);
          });
        }
      }

      this.event.emit('loaded', this);
    });
};

Plugin.prototype.registerCommand = function(command, handler) {
  this.bot.registerCommand(command, function(...args) {
    //Prevents plugins from running commands when
    //they are disabled.
    if(!this.enabled) {
      return;
    }

    handler.apply(handler, args);
  }.bind(this));
};

Plugin.prototype.bind = function(methods) {
  return Object.assign(this, methods);
};

Plugin.prototype.update = function(callback) {
  this.db.update('plugins', {name:this.name},{$set: {
    version: this.version,
    settings: this.settings,
    messages: this.messages
  }}, callback);
};

//send message helper
Plugin.prototype.sendm = function(messageKey, data, channel) {
  this.bot.sendf(this.messages[messageKey], channel, data);
};


module.exports = function(config, bot) {
  return new Plugin(config, bot);
};
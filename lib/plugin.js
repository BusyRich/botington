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
  this.displayName = config['display-name'] || _.startCase(this.name);
  this.icon = this.config.icon || 'fas fa-plug';
  this.version = config.version;
  this.messages = config.messages || {};
  this.settings = config['default-settings'] || {};
  this.dev = config['dev-mode'] || false;
  this.enabled = config['enabled'] || false;
  this.addNav = config['side-nav'] || false;

  this.on = this.event.on.bind(this.event);

  this.unmetDependencies = checkDependencies(
    this.config.dependencies, this.bot.plugins);

  this.setEnabled(this.enabled);
};

//This makes sure a plugin is not enabled
//when its dependencies are not enabled
Plugin.prototype.setEnabled = function(value) {
  if(this.unmetDependencies.length) {
    this.enabled = false;
    return;
  }

  this.enabled = value;
};

Plugin.prototype.load = function() {
  if(this.dev) {
    return this.event.emit('loaded', this);
  }

  this.db.plugins.readOrCreate(
    {name:this.name}, {
      version: this.version,
      settings: this.settings,
      messages: this.messages
    }, (error, data) => {
      if(error) {
        return this.event.emit('error', error);
      }

      if(data) {
        this.setEnabled(data.enabled);

        this.addNav = data.addNav;

        //Settings and Messages cannot be overridden by configs
        //since users can change them. The lodash defaults function
        //allow us to keep any data the user set while supporting new
        //entries provided by new versions of the plugin.
        this.settings = _.defaults({}, 
          data.settings, this.settings);

        this.messages = _.defaults({}, 
          data.messages, this.messages);

        if(data.version != this.version) {
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
  for(var m in methods) {
    this[m] = methods[m].bind(this);
  }

  return this;
};

Plugin.prototype.update = function(callback) {
  this.db.plugins.update({name:this.name}, 
    {$set: {
      version: this.version,
      enabled: this.enabled,
      addNav: this.addNav,
      settings: this.settings,
      messages: this.messages
  }}, callback);
};

Plugin.prototype.enable = function(callback) {
  if(this.enabled) {
    return callback();
  }

  this.unmetDependencies = checkDependencies(
    this.config.dependencies, this.bot.plugins);
  
  if(this.unmetDependencies.length) {
    return callback(`This plugin requires ${this.unmetDependencies[0]}`);
  }

  this.enabled = true;
  this.update(callback);
};

Plugin.prototype.disable = function(callback) {
  if(!this.enabled) {
    return callback();
  }

  for(p in this.bot.plugins) {
    let deps = this.bot.plugins[p].config.dependencies;
    if(deps && deps.length) {
      let d = deps.indexOf(this.name);
      if(d > -1 && this.bot.plugins[p].enabled) {
        return callback(`Plugin ${p} requires this plugin.`);
      }
    }
  }

  this.enabled = false;
  this.update(callback);
};

//send message helper
Plugin.prototype.sendm = function(messageKey, data, channel) {
  this.bot.sendf(this.messages[messageKey], channel, data);
};

Plugin.prototype.pmm = function(username, messageKey, data, channel) {
  this.bot.pmf(username, this.messages[messageKey], channel, data);
};

module.exports = function(config, bot) {
  return new Plugin(config, bot);
};
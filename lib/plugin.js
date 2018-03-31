const path = require('path'),
      _ = require('lodash'),
      EventEmitter = require('events');

module.exports = (config, bot) => {
  //Base plugin object
  const plugin = {
    config: config,
    bot: bot,
    db: bot.db,
    event: new EventEmitter(),
    name: config.name,
    version: config.version,
    messages: config.messages || {},
    settings: config['default-settings'] || {},
    dev: config['dev-mode'] || false,
    ready: handler => {
      if(plugin.dev) {
        handler();
      } else {
        plugin.event.on('ready', handler);
      }
    },
    sendm: (messageKey, data, channel) => { //send message
      plugin.bot.sendf(plugin.messages[messageKey], channel, data);
    },
    //This allows us to obfuscate some fancy context binding we have to 
    //do for plugins, IE makes it so plugin developers don't have to
    //worry about that.
    bind: (context, methods) => {
      return Object.assign(context, plugin, methods);
    }
  };

  const loaded = error => {
    if(error) {
      plugin.event.emit('error', error);
    }

    plugin.event.emit('ready');
  };

  const update = callback => {
    plugin.db.update('plugins', {name:plugin.name},{$set: {
      version: plugin.version,
      settings: plugin.settings,
      messages: plugin.messages
    }}, callback);
  };

  if(!plugin.dev) {
    //Get the plugin from the DB or create the record
    //for a brand new plugin
    plugin.db.getOrCreate('plugins', 
      {name:plugin.name}, {
        version: plugin.version,
        settings: plugin.settings,
        messages: plugin.messages
      }, (error, result) => {
        if(error) {
          return loaded(error);
        }

        if(result.value) {
          //Settings and Messages cannot be overridden by configs
          //since users can change them. The lodash defaults function
          //allow us to keep any data the user set while supporting new
          //entries provided by new versions of the plugin.
          plugin.settings = _.defaults({}, 
            result.value.settings, plugin.settings);

          plugin.messages = _.defaults({}, 
            result.value.messages, plugin.messages);

          if(result.value.version != plugin.version) {
            return update(loaded);
          }
        }

        loaded();
      });
  }
  
  //Combine the base plugin object with the specific plugin instance
  return Object.assign(this, require(path.join(plugin.config.main))(plugin));
};
const path = require('path'),
      fs = require('fs'),
      Plugin = require(path.join(__dirname, 'plugin')),
      pluginConfig = 'plugin.json',
      EventEmitter = require('events');

module.exports = () => {
  //Build an array of plugin collection paths
  let dirs = [path.resolve(__dirname, '../plugins')],
      configs = [],
      plugins = {},
      event = new EventEmitter();

  const loadPaths = () => {
    if(this.bot.config.hasOwnProperty('plugin-paths')) {
      //Add user plugin paths
    }
  
    //Load in the plugin configs
    for(let d = 0; d < dirs.length; d++) {
      let folders = fs.readdirSync(dirs[d]);
      for(let c = 0; c < folders.length; c++) {
        let config = path.join(dirs[d], folders[c], pluginConfig);
        if(fs.existsSync(config)) {
          config = require(config);

          //sets the main file path to an absolute path
          config.main = path.join(dirs[d], folders[c], config.main);
          
          if(config.ui && config.ui.component) {
            config.ui.component = path.join(
              dirs[d], folders[c], config.ui.component);
          }

          configs.push(config);
        }
      }
    }
  }

  let i = 0; //The current index in the configs array to check
  const load = () => {
    if(configs.length === 0) {
      console.log('All Plugins Loaded.');
      return event.emit('ready');
    }

    i = (i < configs.length ? i : 0);
    
    let ds = configs[i].dependencies,
        addConfig = true;

    if(ds && ds.length) {
      for(let d = 0; d < ds.length; ds++) {
        if(!plugins.hasOwnProperty(ds[d])) {
          addConfig = false;
          break;
        }
      }
    }

    if(addConfig) {
      process.stdout.write(`* Loading ${configs[i].name}...`);
      let p = Plugin(configs.splice(i, 1)[0], this.bot);
      p.on('loaded', loaded);
      p.load();
    } else {
      i++;
      load();
    }
  };

  const loaded = (plugin) => {
    plugins[plugin.name] = require(plugin.config.main)(plugin);
    plugins[plugin.name].on('ready', () => {
      process.stdout.write(`${(plugin.enabled ? "Enabled" : "Disabled")}\n`);
      load();
    });
    plugins[plugin.name].initialize();
  };

  return Object.assign(this, {
    plugins,
    on: event.on.bind(event),
    load: bot => {
      this.bot = bot;
      loadPaths();
      console.log('Loading Plugins:');
      if(this.bot.db.connected) {
        load();
      } else {
        this.bot.db.on('connect', load);
      }
    }
  });
};
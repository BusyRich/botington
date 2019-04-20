const path = require('path'),
      orum = require('orum'),
      textFormatter = require('./systems/formatter'),
      ServiceManager = require('./services/service_manager'),
      UsersSystem = require('./systems/system.users'),
      CommandManager = require('./systems/system.commands'),
      dbConfig = require('../config.db.json');

orum.register('loki');

class Bot {
  constructor() {
    this.format = textFormatter;

    this.services = new ServiceManager();

    this.db = orum.create(dbConfig);
    this.db.model(path.join(__dirname, 'models', 'configuration.js'));
  }

  on(serviceName, eventName, callback) {
    if(this.services[serviceName]) {
      this.services[serviceName].on(eventName, callback);
    }
  }

  off(serviceName, eventName, callback) {
    if(this.services[serviceName]) {
      this.services[serviceName].off(eventName, callback);
    }
  }

  start() {
    return this.db.connect()
      .then(() => this.db.models.configuration.read({type:1}))
      .then(configs => {
        configs.forEach(config =>
          this.services.add(config.key, config.configuration));

        return this.services.connect();
      })
      .then(() => {
        this.users = new UsersSystem(this);
        this.commands = new CommandManager(this);
      })
      .then(() => console.log('Services Connected. Bot Ready.'));
  }
}

const bot = new Bot();

bot.start().then(() => {
  bot.commands.register('test', (name, age) => {
    console.log(name, age);
    bot.services.twitch.say(bot.format('Hello {0} who is {1} years old.', name, age));
  });

  bot.commands.alias('test', 't');
  bot.commands.alias('t', 'too');
});

module.exports = Bot;
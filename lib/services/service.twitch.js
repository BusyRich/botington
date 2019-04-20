const Service = require('./service'),
      twitchell = require('twitchell');

class TwitchService extends Service {
  constructor(config) {
    super(config);

    this.botConnection = twitchell(
      config.bot.username,
      config.bot.token, 
      config.channels
    );

    this.on = this.botConnection.on.bind(this.botConnection);
    this.off = this.botConnection.off.bind(this.botConnection);
    this.emit = this.botConnection.emit.bind(this.botConnection);
    this.say = this.botConnection.say.bind(this.botConnection);

    this.on('names', data => {
      this.emit('userlist', data.users);
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.botConnection.on('connect', resolve);
      this.botConnection.connect();
    });
  }
}

module.exports = TwitchService;
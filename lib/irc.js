/*
 * Handles the connection to and parsing of Twitch IRC.
 * https://github.com/kritzware/twitch-bot was used
 * as template to bootstrap the basic logic here.
 */
const path = require('path'),
      parse = require(path.join(__dirname, 'parse')),
      tls = require('tls');

const IRC = function(username, authToken, channels) {
  this.username = username;
  this.token = authToken;
  this.channels = channels;
  this.socket = new tls.TLSSocket();

  //Some aliases for event handling
  this.on = this.socket.on.bind(this.socket);
  this.off = this.socket.removeListener.bind(this.socket);
  this.emit = this.socket.emit.bind(this.socket);

  //Line processing and IRC event emitting
  this.socket.on('data', data => {
    this.parseData(data);
  });
};

IRC.prototype.connect = function() {
  this.socket.connect({
    host: 'irc.chat.twitch.tv',
    port: 443
  });

  this.socket.setEncoding('utf8');
  this.socket.once('connect', () => {
    this.login();
  });
}

IRC.prototype.login = function(token) {
  console.log(`IRC Connected. Logging in ${this.username}.`);

  //Log the bot user into IRC
  this.send('PASS', this.token);
  this.send('NICK', this.username);

  //destroy the token so its not floating in memory
  this.token = '';
  
  //Enable IRC V3 message tags
  this.send('CAP', 'REQ', ':twitch.tv/tags');
  
  //Enable membership events
  this.send('CAP', 'REQ', ':twitch.tv/membership');

  //Enable Twitch-specific IRC commands
  this.send('CAP', 'REQ', ':twitch.tv/commands');

  console.log('Attempting to Join target channels.');

  //Join all the channels
  for(let c = 0; c < this.channels.length; c++) {
    this.send('JOIN', `#${this.channels[c]}`);
  }
};

//Sends a message to the IRC server
//Arguments should be strings to space separate
IRC.prototype.send = function(...text) {
  this.socket.write(`${text.join(' ')} \r\n`);
};

IRC.prototype.parseData = function(rawData) {
  let lines = rawData.split('\r\n'), lineData;

  for(let l = 0; l < lines.length; l++) {
    //Keep alive
    if(lines[l].indexOf('PING :tmi.twitch.tv') > -1) {
      console.log('Keep Alive');
      this.send('PONG :tmi.twitch.tv');
      continue;
    }

    lineData = parse(lines[l]);
    
    if(lineData.type) {
      //Special channel event
      if(lineData.type == 'join' &&
        lineData.username == this.username && 
        this.channels.includes(lineData.channel))
      {
        lineData.type = 'channel';
      }

      this.socket.emit(lineData.type, lineData);
    }
  }
}

module.exports = function(username, authToken, channels) {
  return new IRC(username, authToken, channels);
};
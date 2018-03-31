/*
 * Handles the connection to and parsing of Twitch IRC.
 * https://github.com/kritzware/twitch-bot was used
 * as template to bootstrap the basic logic here.
 */

const path = require('path'),
      Parser = require(path.join(__dirname, 'parse')),
      tls = require('tls');

module.exports = config => {
  const socket = new tls.TLSSocket(),
        parse = Parser(config);

  //Line processing and IRC event emitting
  socket.on('data', data => {
    let lines = data.split('\r\n'), lineData;

    for(let l = 0; l < lines.length; l++) {
      lineData = parse.line(lines[l]);
      
      if(lineData.type) {
        socket.emit(lineData.type, lineData);
      }
    }
  });

  //Sends a message to the IRC server
  //Arguments should be strings to space separate
  const send = (...text) => {
    socket.write(`${text.join(' ')} \r\n`);
  };

  //Logs in and enables some Twtich-specific IRC settings
  const login = () => {
    console.log(`IRC Connected. Logging in ${config['bot-username']}.`);

    //Log the bot user into IRC
    send('PASS', config['bot-oauth']);
    send('NICK', config['bot-username']);
    
    //Enable IRC V3 message tags
    send('CAP', 'REQ', ':twitch.tv/tags');
    
    //Enable membership events
    send('CAP', 'REQ', ':twitch.tv/membership');

    //Enable Twitch-specific IRC commands
    send('CAP', 'REQ', ':twitch.tv/commands');

    console.log('Attempting to Join target channels.');

    //Join all the channels
    for(let c = 0; c < config.channels.length; c++) {
      send('JOIN', `#${config.channels[c]}`);
    }
  };

  return Object.assign(this, {
    on: socket.on.bind(socket),
    off: socket.removeListener.bind(socket),
    emit: socket.emit.bind(socket),
    connect: () => {
      socket.connect({
        host: 'irc.chat.twitch.tv',
        port: config['irc-port'] || 443
      });
      socket.setEncoding('utf8');
      socket.once('connect', login);
    },
    send: send
  });
};
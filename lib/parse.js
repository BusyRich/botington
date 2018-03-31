module.exports = config => {
  //Regular Expressions used to match and parse specific messages
  const parsers = {
    username: '[a-z0-9_]{4,25}',
    command: new RegExp('^!([a-z]+)\\s*("*.*?"*\\s*)$','i'),
    args: new RegExp('([a-z0-9_]+|".*?")\\s*', 'gi'),
    metadata: new RegExp('([a-z\-]+)=([^;]+)','gi'),
    badge: new RegExp('([a-z_]+)\/([0-9]+)','gi')
  };

  parsers.names = new RegExp(':' + parsers.username + 
      '\.tmi\.twitch\.tv 353 ' + parsers.username + 
      ' = #(' + parsers.username + ') :(.*?)$', 'i');

  //Works with Join, part, and privmsg events
  parsers.basic = new RegExp('(@.*? )?:(' + parsers.username +')!' + 
    parsers.username + '@' + parsers.username + 
    '\.tmi\.twitch\.tv ([a-z]+) #(' + 
    parsers.username +')( :.*)?','i');

  //Some meta data is redundant or not needed
  const supportedMeta = [
    'badges', 'color', 'user-id', 
    'mod', 'subscriber', 'user-type',
    'tmi-sent-ts', 'turbo', 
  ];

  const parse = (type, text, multi) => {
    if(parsers[type]) {
      //for multiple matches in one string
      //we must use a loop because exec is required
      //for grouping
      if(multi === true) {
        let matches = [], matchTmp;
        do {
          matches.push((matchTmp = parsers[type].exec(text)));
        } while(matchTmp != null)
  
        matches.pop(); //remove the null element
        return matches;
      }
  
      return parsers[type].exec(text);
    }
  };

  const join = data => {
    if(data.username == config['bot-username'] && 
      config.channels.includes(data.channel))
    {
      data.type = 'channel';
    }
  
    return data;
  };

  const meta = metaString => {
    let metaList = parse('metadata', metaString, true),
        metaData = {};
  
    for(let t = 0; t < metaList.length; t++) {
      if(supportedMeta.includes(metaList[t][1])) {
        switch(metaList[t][1]) {
          case 'badges':
            metaData.badges = {};
  
            let badges = parse('badge', metaList[t][2], true);
            for(let b = 0; b < badges.length; b++) {
              metaData.badges[badges[b][1]] = badges[b][2];
            }
  
            break;
          case 'subscriber': //true/false flags
          case 'mod':
          case 'turbo':
            metaData[metaList[t][1]] = (metaList[t][2] == '1' ? true : false);
            break;
          case 'tmi-sent-ts': //sent timestap
            metaDatasent = new Date(parseInt(metaList[t][2])).toISOString();
            break;
          default:
            metaData[metaList[t][1]] = metaList[t][2];
            break;
        }
      }
    }

    return metaData
  };

  const args = argString => {
    let argsArray = [];
  
    if(argString && argString.length > 0) {
      let tmpArgs = parse('args', argString, true);
      
      for(let a = 0; a < tmpArgs.length; a++) {
        if(tmpArgs[a][1].indexOf('"') === 0) {
          argsArray.push(tmpArgs[a][1].slice(1,-1)); //don't include "s
        } else {
          argsArray.push(tmpArgs[a][1]);
        }
      }
    }

    return argsArray;
  };

  const message = data => {
    let match;

    data.meta = meta(data.meta);

    if((match = parse('command', data.message))) {
      data.type = 'command';
      data.command = match[1];
      data.arguments = args(match[2]);
      delete data.message; //don't need the message on commands
    } else{
      data.type = 'message';
    }

    return data;
  };

  return Object.assign(this, {
    line: line => {
      let match, data = {};
    
      //JOIN, PART, and PRIVMSG
      if((match = parse('basic', line))) {
        data.type = match[3].toLowerCase();
        data.username = match[2];
        data.channel = match[4];
  
        switch(data.type) {
          case 'join':
            data = join(data);
            break;
          case 'privmsg':
            data.message = match[5].slice(2); //starts with ' :'
            data.meta = match[1].slice(1, -1); //starts with @ and ends with a space
            data = message(data);
            break;
        }      
      }
    
      //Check for NAMES data
      if((match = parse('names', line))) {
        data.type = 'names'; 
        data.users = match[2].split(' ');
      }
  
      return data;
    }
  });
};

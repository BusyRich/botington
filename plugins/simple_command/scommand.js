module.exports = plugin => {
  const commands = {}
        purchase = plugin.bot.plugins['member-points'].purchase;

  //One handler can be used for all commands, since they all just
  //display text.
  const handleCommand = meta => {
    if(commands[meta.command]) {
      let c = commands[meta.command];
      if(!c.cost || c.cost === 0) {
        this.bot.send(c.text);
      } else {
        purchase(meta.username, c.cost, success => {
          if(success) {
            plugin.bot.send(c.text);
          }
        });
      }
    }
  };

  plugin.db.getAll('commands', (error, data) => {
    if(error) {
      return plugin.event.emit('error', error);
    }

    for(let c = 0; c < data.length; c++) {
      commands[data[c].name] = data[c];
      this.registerCommand(data[c].name, handleCommand);
    }
  });

  return plugin.bind(this, {});
};
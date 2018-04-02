module.exports = plugin => {
  return plugin.bind({
    initialize() {
      this.commands = {}
      this.purchase = this.bot.plugins['member-points'].purchase;

      //One handler can be used for all commands, since they all just
      //display text.
      const handleCommand = meta => {
        if(this.commands[meta.command]) {
          let c = this.commands[meta.command];
          if(!c.cost || c.cost === 0) {
            this.bot.send(c.text);
          } else {
            purchase(meta.username, c.cost, success => {
              if(success) {
                this.bot.send(c.text);
              }
            });
          }
        }
      };

      plugin.db.getAll('commands', (error, data) => {
        if(error) {
          return this.event.emit('error', error);
        }

        for(let c = 0; c < data.length; c++) {
          this.commands[data[c].name] = data[c];
          this.registerCommand(data[c].name, handleCommand);
        }

        this.event.emit('ready');
      });
    }
  });
};
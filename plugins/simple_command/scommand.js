module.exports = plugin => {
  return plugin.bind({
    initialize() {
      this.commands = {}
      
      const purchase = this.bot.plugins['member-points'].purchase;

      const runCommand = (text, meta) => {
        if(text[0] === '!') {
          meta.alias = meta.command;
          meta.command = text.substring(1);
          this.bot.runCommand(meta.command, meta);
        } else {
          this.bot.db.getMember(meta.username, (error, member) => {
            if(error) {
              console.log(error);
            }

            this.bot.send(this.bot.format(text, {
              uptime: this.bot.uptime,
              channel: meta.channel,
              member: member
            }));
          });
        }
      };

      //One handler can be used for all commands, since they all just
      //display text.
      const handleCommand = meta => {
        if(this.commands[meta.command]) {
          let c = this.commands[meta.command];
          if(!c.cost || c.cost === 0) {
            runCommand(c.text, meta);
          } else {
            purchase(meta.username, c.cost, success => {
              if(success) {
                runCommand(c.text, meta);
              }
            });
          }
        }
      };

      this.db.getAll('commands', (error, data) => {
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
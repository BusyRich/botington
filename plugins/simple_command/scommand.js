module.exports = plugin => {
  return plugin.bind({
    initialize() {
      this.commands = {}
      this.purchase = this.bot.plugins['member-points'].purchase;

      this.db.getAll('commands', (error, data) => {
        if(error) {
          return this.event.emit('error', error);
        }

        for(let c = 0; c < data.length; c++) {
          this.commands[data[c].name] = data[c];
          this.register(data[c].name);
        }

        this.event.emit('ready');
      });
    },
    register(name) {
      this.registerCommand(name, this.handleCommand.bind(this));
    },
    runCommand(text, meta) {
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
    },
    //One handler can be used for all commands, since they all just
    //display text.
    handleCommand(meta) {
      if(this.commands[meta.command]) {
        let c = this.commands[meta.command];
        if(!c.cost) {
          this.runCommand(c.text, meta);
        } else {
          this.purchase(meta.username, c.cost, success => {
            if(success) {
              this.runCommand(c.text, meta);
            }
          });
        }
      }
    },
    saveCommand(name, update, callback) {
      this.db.updateOrCreate('commands', {name:name}, update, (error, result) => {
        if(error) {
          callback('Mongo Error');
          return console.log(error);
        }

        this.commands[update.name] = update;

        if(result.value && update.name !== result.value.name) {
          this.remove(result.value.name, (error) => {
            this.register(update.name);
            callback();
          });
        } else if(!result.value && result.ok) {
          this.register(update.name);
          callback();
        } else {
          callback();
        }
      });
    },
    removeCommand(name, callback) {
      this.db.remove('commands', {name:name}, (error) => {
        if(error) {
          callback('Mongo Error');
          return console.log('error');
        }

        delete this.commands[name];
        callback();
      });
    }
  });
};
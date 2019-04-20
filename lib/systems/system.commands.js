
class CommandManager {
  constructor(botInstance) {
    this.commands = {};
    this.aliases = {};

    botInstance.services.forEach(service => {
      service.on('command', data => this.call(data.command, data.arguments));
    });
  }

  register(commandName, handler) {
    if(!this.commands.hasOwnProperty(commandName)) {
      this.commands[commandName] = handler;
    }
  }

  alias(commandName, alias) {
    this.aliases[alias] = commandName;
  }

  call(commandName, args) {
    let handler = this.commands[commandName];


    if(!handler && this.aliases.hasOwnProperty(commandName)) {
      let aliasedCommand = commandName;

      while(this.aliases.hasOwnProperty(aliasedCommand)) {
        aliasedCommand = this.aliases[aliasedCommand];
      }

      if(this.commands.hasOwnProperty(aliasedCommand)) {
        handler = this.commands[aliasedCommand];
      }
    }

    if(handler) {
      handler.apply(handler, args);
    }
  }
}

module.exports = CommandManager;
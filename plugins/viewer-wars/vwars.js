var Character = require('./Character.js');
module.exports = plugin => {
  return plugin.bind({
    initialize() {

      /*
      Viewer interactive stream battles
      each viewer can create 1 character and use them to battle other characters
      mods / broadcasters can send out raid style bosses for all viewers to battle
      Earn / trade / buy / sell weapons and armor
      Level Up
      reset character
      join factions
      */
      // if (!this.enabled) {
      //   return;
      // }
      this.registerCommand('vwars', this.handleCommands);
      this.event.emit('ready');
    },
    handleCommands(cmd) {
      let [subCmd, ...args] = cmd.arguments;
      switch (subCmd) {
        case "store":
          this.getStore(cmd.username);
          break;
        case "createCharacter":
          let [n, g, r, c, d] = args;
          if (!n || !g || !r || !c || !d) {
            this.bot.pm(cmd.username, "Please provide all inputs in the format vwars createCharacter name gender race classification description ");
          } else {
            let newChar = Character(n, g, r, c, d);
            this.db
          }
          break;
        default:
          break;
      }
    },
    getStore(userName) {
      this.db.getAll('vwars-items', (err, data) => {
        let str = ""
        data.forEach(element => {
          str += element.name + ": " + element.value + " | ";
        });
        this.bot.pm(userName, str);
      });
    },



  });
};
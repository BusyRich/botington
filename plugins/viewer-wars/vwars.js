var Character = require('./Character.js')
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

      */
      // if (!this.enabled) {
      //   return;
      // }
      this.event.emit('ready');
    }
  });
};
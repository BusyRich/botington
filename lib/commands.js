/*
 * These are the basic commands that are available by default.
 * Mostly just getting and displaying information, and not
 * complex or custom logic. Plugins are (and should always be) 
 * used for anything more extensive.
 */
 module.exports = bot => {
  bot.registerCommand('age', (metadata) => {
    bot.db.getMember(metadata.username, (err, member) => {
      if(!err) {
        bot.send(`@${member.username} your age is ${member.age} minutes`);
      }
    });
  });
 };
module.exports = plugin => {
  this.pname = plugin.settings['points-name'];

  //Adds points to all current chatters every refresh (60s)
  plugin.bot.on('refresh', () => {
    if(!this.enabled) {
      return;
    }

    this.bot.updateAllChatters({
      $inc: {points:this.settings['points-per-refresh']}
    },
    (err) => console.log(err || 'Member Points Updated'));
  });

  //Register the "check points" command
  plugin.registerCommand(this.pname, (meta) => {
    this.db.getMember(meta.username, (error, member) => {
      if(error) {
        this.event.emit('error', error);
      }

      let messageData = Object.assign({pname:this.pname}, member);
      if(member && member.points) {
        this.sendm('check', messageData);
      } else {
        this.sendm('no-points', messageData);
      }
    });
  });

  return plugin.bind(this, {
    deposit: (member, amount, callback) => {
      this.db.updateMember({
        username: member
      }, {
        $inc: {points: amount}
      }, (error, result) => {
        if(error) {
          this.event.emit('error', error);
          return callback(false);
        }

        callback(true);
      });
    },
    purchase: (member, amount, callback) => {
      this.db.updateMember({
        username: member,
        points: { $gte: amount }
      }, {
        $inc: {points: -(amount)}
      }, (error, result) => {
        if(error) {
          this.event.emit('error', error);
        }

        if(result && result.modifiedCount === 0) {
          this.sendm('not-enough', {username:member,pname:this.pname});
          callback(false);
        } else {
          callback(true);
        }
      });
    }
  });
};
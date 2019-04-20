const path = require('path');

class UsersSystem {
  constructor(botInstance) {
    this.users = [];

    this.model = botInstance.db.model(path.join(__dirname, '../models/user.base.js'));

    //Reset Everyone's online status when we first load
    this.model.update({}, {$set:{online:{}}}).then(() => {
      botInstance.services.forEach(service => {
        service.on('userlist', users => this.userlist(service.name, users));
        service.on('join', joinData => this.status(service.name, joinData));
        service.on('part', partData => this.status(service.name, partData, false));
      });
    });
  }

  getOnlineUpdate(serviceName, online = true) {
    return {
      $set:{ [`online.${serviceName}`]: online },
      $setOnInsert: { online:{[serviceName]: online }}
    };
  }

  userlist(serviceName, usernames) {
    return this.model.updateOrCreateMany('username', usernames, 
      this.getOnlineUpdate(serviceName));
  }

  status(serviceName, data, online = true) {
    console.log('Status Change', data.username, online);

    return this.model.updateOrCreate(
      {username:data.username},
      this.getOnlineUpdate(serviceName, online));
  }
}

module.exports = UsersSystem;
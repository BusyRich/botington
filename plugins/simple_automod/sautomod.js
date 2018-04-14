module.exports = plugin => {
  return plugin.bind({
    initialize() {
      this.settings = plugin.settings;

      this.bot.on('message', data => {
        //Check for plugin enabled
        if (!this.enabled) {
          return;
        }
        if (!data.meta.hasOwnProperty('badges')) {
          data.meta.badges = {
            broadcaster: 0,
            moderator: 0
          };
        }
        if (!data.meta.badges.hasOwnProperty('broadcaster')) {
          data.meta.badges.broadcaster = 0;
        }
        if (!data.meta.badges.hasOwnProperty('moderator')) {
          data.meta.badges.moderator = 0;
        }
        if ((data.meta.badges.broadcaster == '1'
          && this.settings['ignore-broadcaster'] === false)
          || (data.meta.badges.moderator == '1'
            && this.settings['ignore-mods'] === false)
          || (data.meta.badges.broadcaster !== '1'
            && data.meta.badges.moderator !== '1'
          )) {
          var words = data.message.split(" ");
          for (let i = 0; i < words.length; i++) {
            if (this.settings['restricted-words'].includes(words[i].toLowerCase())) {
              this.updateStrikes(data.username, 'restricted');
              return i;
            } else if (this.validURL(words[i]) && this.settings['remove-urls']) {
              this.updateStrikes(data.username, 'urlRestricted');
            }
          }
        }
      });
      this.event.emit('ready');

      this.validURL = function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?' + // port
          '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
          '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
      };
      this.updateStrikes = function (user, message) {
        this.db.updateMember({
          username: user,
        }, {
            $inc: { automodStrikes: 1 }
          }, (error, result) => {
            if (error) {
              this.event.emit('error', error);
            }
            this.db.getMember(user, (error, member) => {
              if (error) {
                this.event.emit('error', error);
              }

              if (member && member.automodStrikes > this.settings['progressive-timeout-threshold'] && this.settings['progressive-timeouts']) {
                this.sendm('progressive-timeout', { username: user, length: member.automodStrikes * this.settings['progressive-timeout-length'] });
                this.sendm(message, { username: user, count: member.automodStrikes });
              } else {
                this.sendm('timeout', { username: user });
                this.sendm(message, { username: user, count: member.automodStrikes });
              }
            });

          });
      };

    }
  });
};
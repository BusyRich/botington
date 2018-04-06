module.exports = plugin => {
  return plugin.bind( {
    initialize() {
      this.restrictedWords = plugin.settings['restricted-words'];
      this.disableURLPosting = plugin.settings['remove-urls'];
      this.disableForBroadcaster = plugin.settings['ignore-broadcaster'];
      this.disableForMods = plugin.settings['ignore-mods'];
      this.progressiveTimeout = plugin.settings['progressive-timeouts'];
      this.progressiveTimeoutAmount = plugin.settings['progressive-timeout-length'];
      this.progressiveTimeoutThreshold = plugin.settings['progressive-timeout-threshold'];

      //console.log( plugin );

      // this.db.updateMany(
      //   'members',
      //   { automodStrikes: { $gt: 0 } },
      //   'automodStrikes',
      //   { $set: { automodStrikes: 0 } },
      //   ( err ) => console.log( error || 'Automod Flags Reset' )
      // );

      this.bot.on( 'message', data => {
        if ( !this.enabled ) {
          return;
        }

        if ( ( data.meta.badges.broadcaster == '1'
          && this.disableForBroadcaster === false )
          || ( data.meta.badges.moderator == '1'
            && this.disableForMods === false )
          || ( data.meta.badges.broadcaster !== '1'
            && data.meta.badges.moderator !== '1'
          ) ) {
          var words = data.message.split( " " );
          for ( let i = 0; i < words.length; i++ ) {
            if ( this.restrictedWords.includes( words[i].toLowerCase() ) ) {
              this.sendm( 'restricted', data );
              this.updateStrikes( data.username, 'restricted' );
              return i;
            } else if ( this.validURL( words[i] ) && this.disableURLPosting ) {
              this.updateStrikes( data.username, 'urlRestricted' );
            }
          }
        }
      } );
      this.event.emit( 'ready' );

      this.validURL = function ( str ) {
        var pattern = new RegExp( '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?' + // port
          '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
          '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i' ); // fragment locator
        return pattern.test( str );
      };
      this.updateStrikes = function ( user, message ) {
        this.db.updateMember( {
          username: user,
        }, {
            $inc: { automodStrikes: 1 }
          }, ( error, result ) => {
            if ( error ) {
              this.event.emit( 'error', error );
            }
            this.db.getMember( user, ( error, member ) => {
              if ( error ) {
                this.event.emit( 'error', error );
              }

              if ( member && member.automodStrikes > this.progressiveTimeoutThreshold && this.progressiveTimeout ) {
                this.sendm( 'progressive-timeout', { username: user, length: member.automodStrikes * this.progressiveTimeoutAmount } );
                this.sendm( message, { username: user, count: member.automodStrikes } );
              } else {
                this.sendm( 'timeout', { username: user } );
                this.sendm( message, { username: user, count: member.automodStrikes } );
              }
            } );

          } );
      };

    }
  } );
};
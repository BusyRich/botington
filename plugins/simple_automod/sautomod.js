module.exports = plugin => {
  return plugin.bind( {
    initialize() {
      this.restrictedWords = plugin.settings['restricted-words'];
      this.disableURLPosting = plugin.settings['remove-urls'];
      this.bot.on( 'message', data => {
        var words = data.message.split( " " );
        for ( let i = 0; i < words.length; i++ ) {
          if ( this.restrictedWords.includes( words[i].toLowerCase() ) ) {
            this.sendm( 'restricted', data );
            this.sendm( 'timeout', data );
            return i;
          } else if ( validURL( words[i] && this.disableURLPosting ) ) {
            this.sendm( 'urlRestricted', data );
            this.sendm( 'timeout', data );
          }
        }
      } );
      this.event.emit( 'ready' );

      function validURL( str ) {
        var pattern = new RegExp( '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?' + // port
          '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
          '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i' ); // fragment locator
        return pattern.test( str );
      }

    }
  } );
};
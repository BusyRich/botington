module.exports = plugin => {
  return plugin.bind( {
    initialize() {
      this.restrictedWords = plugin.settings['restricted-words'];
      this.bot.on( 'message', data => {
        var words = data.message.split( " " );
        for ( let i = 0; i < words.length; i++ ) {
          if ( this.restrictedWords.includes( words[i].toLowerCase() ) ) {
            this.sendm( 'restricted', data );
            this.sendm( 'timeout', data );
            return i;
          }
        }
      } );
      this.event.emit( 'ready' );
    }
  } );
};
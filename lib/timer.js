const EventEmitter = require('events');

//We will need to add in a custom loop here for handling these
//timers to eliminate the possibility of waiting almost a minute
//before the next check is.
module.exports = Timer = function(bot, minutes, singleUse = false) {
  this.bot = bot;
  this.minutes = minutes;
  this.done = true;
  
  //We create these inside the constructor 
  //for easier context binding
  this.refreshCallback = () => {
    this.check();
  };

  if(singleUse) {
    this.start();
  }

  //mixin the event emitter methods
  return Object.assign(this, EventEmitter.prototype);
};

Timer.prototype.start = function() {
  this.start = Date.now();
  this.end = this.start + (this.minutes * 60 * 1000);
  this.done = false;
  this.bot.on('refresh', this.refreshCallback);
};

//Return time left in seconds
Timer.prototype.check = function() {
  if(this.done) {
    return 0;
  }

  let secs = Math.floor((this.end - Date.now()) / 1000);

  //5 second buffer because timing is not perfect in JS and 
  //missing most likely means more than just a few seconds 
  //before the next check, thus making the timer overrun
  if(secs <= 5) { 
    this.done = true;
    this.complete();
    secs = 0;
  }

  return secs;
};

Timer.prototype.complete = function() {
  this.bot.off('refresh', this.refreshCallback);
  this.emit('end');
};

Timer.prototype.destroy = function() {
 
};

const EventEmitter = require('events');

module.exports = Timer = function(minutes) {
  this.minutes = minutes;
  this.reset();

  //mixin the event emitter methods
  return Object.assign(this, EventEmitter.prototype);
};

Timer.prototype.reset = function() {
  this.start = Date.now();
  this.end = this.start + (this.minutes * 60 * 1000);
  this.done = false;
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
    this.emit('end');
    secs = 0;
  }

  return secs;
};

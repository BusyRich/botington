const EventEmitter = require('events'),
      timers = [];

//A separate loop is required so checking is
//more often then every minute and so starts
//begin almost immediately
setInterval(function() {
  for(let t of timers) {
    t.check();
  }
}, 5000);

module.exports = Timer = function(minutes, singleUse = false) {
  this.minutes = minutes;
  this.done = true;

  if(singleUse) {
    this.start();
  }

  //mixin the event emitter methods
  return Object.assign(this, EventEmitter.prototype);
};

Timer.prototype.start = function() {
  this.timeEnd = Date.now() + (this.minutes * 60 * 1000);
  this.done = false;
  this.index = timers.length;
  timers.push(this);
};

//Return time left in seconds
Timer.prototype.check = function() {
  if(this.done) {
    return 0;
  }

  let secs = Math.floor((this.timeEnd - Date.now()) / 1000);

  //5 second buffer because timing is not perfect in JS
  if(secs <= 5) { 
    this.done = true;
    this.stop();
    this.emit('complete');
    secs = 0;
  }

  return secs;
};

Timer.prototype.stop = function() {
  timers.splice(this.index, 1);
};

const EventEmitter = require('events');

class Service extends EventEmitter {
  constructor(config) { 
    super(); 
  
    this.config = config;
  }

  connect() {}
}

module.exports = Service;
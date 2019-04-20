const knownServices = {
  twitch: require('./service.twitch')
};

class ServiceManager {
  constructor() {
    this.services = [];
  }

  add(serviceName, config) {
    if(knownServices.hasOwnProperty(serviceName)) {
      const service = new knownServices[serviceName](config);
      service.name = serviceName;

      this.services.push(service);
      this[serviceName] = service;
    }
  }

  forEach(callback) {
    this.services.forEach(callback);
  }

  connect() {
    return Promise.all(
      this.services.map(service => {
        return service.connect();
      })
    );
  }
}

module.exports = ServiceManager;
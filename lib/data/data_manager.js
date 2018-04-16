const MongoClient = require('mongodb').MongoClient,
  EventEmitter = require('events');

module.exports = function (config) {
  const collections = {},
    operators = {},
    queue = [],
    event = new EventEmitter();

  let db;

  this.connected = false;

  const queued = function (funct, args) {
    if (db) {
      return false;
    } else {
      queue.push([funct, args]);
      return true;
    }
  };

  const runQueue = function () {
    for (var q = 0; q < queue.length; q++) {
      operators[queue[q][0]].apply(...queue[q]);
    }
  };

  const getCollection = function (name) {
    if (!collections.hasOwnProperty(name)) {
      collections[name] = db.collection(name);
    }

    return collections[name];
  };

  //For the queuing system to work, the arguments
  //are collected via rest syntax and expanded
  //when used.

  //Get operators
  operators.get = (...args) => {
    if (!queued('get', args)) {
      let [collection, query, callback] = args,
        c = getCollection(collection);

      c.findOne(query, callback);
    }
  };

  operators.updateAndGet = (...args) => {
    if (!queued('updateAndGet', args)) {
      let [collection, filter, update, callback] = args,
        c = getCollection(collection);

      c.findOneAndUpdate(filter, update, callback);
    }
  };

  operators.getOrCreate = (...args) => {
    if (!queued('getOrCreate', args)) {
      let [collection, filter, document, callback] = args,
        c = getCollection(collection);

      c.findOneAndUpdate(filter, {
        $setOnInsert: document || filter
      }, {
          upsert: true
        }, callback);
    }
  };

  operators.updateOrCreate = (...args) => {
    if (!queued('updateOrCreate', args)) {
      let [collection, filter, update, callback] = args,
        c = getCollection(collection);

      c.findOneAndUpdate(filter, update, {
        upsert: true
      }, callback);
    }
  };

  operators.getAll = (...args) => {
    if (!queued('getAll', args)) {
      let [collection, callback] = args,
        c = getCollection(collection);

      c.find().toArray(callback);
    }
  };

  operators.getMember = (...args) => {
    if (!queued('getMember', args)) {
      let [username, callback] = args;
      operators.getOrCreate('members',
        { username: username }, null, (error, data) => {
          if (error) {
            return callback(error);
          }

          callback(null, data.value);
        });
    }
  };

  //Update operators
  operators.update = (...args) => {
    if (!queued('udpate', args)) {
      let [collection, filter, update, callback] = args,
        c = getCollection(collection);

      c.updateOne(filter, update, callback);
    }
  };

  operators.updateMany = (...args) => {
    if (!queued('setMany', args)) {
      let [collection, filter, update, callback] = args,
        c = getCollection(collection);

      c.update(filter, update, {
        multi: true
      }, callback);
    }
  };

  operators.updateMember = (...args) => {
    if (!queued('udpateMember', args)) {
      let c = getCollection('members');
      c.updateOne(...args);
    }
  };

  operators.updateMembers = (...args) => {
    if (!queued('updateMembers', args)) {
      let [members, update, callback] = args,
        c = getCollection('members'),
        op = c.initializeOrderedBulkOp();

      //We use a bulk operation so any users that don't
      //exist are created from the upsert.
      for (let m = 0; m < members.length; m++) {
        op.find({ username: members[m] })
          .upsert()
          .updateOne(update);
      };

      op.execute(callback);
    }
  };

  operators.remove = (...args) => {
    if (!queued('remove', args)) {
      let [collection, filter, callback] = args,
        c = getCollection(collection);

      c.deleteOne(filter, callback);
    }
  };

  //When connected
  MongoClient.connect(config.data['connect-url'], (error, client) => {
    db = client.db(config.data['db']);
    this.connected = true;
    console.log("Successfully Connected to MongoDB");
    event.emit('connect');

    runQueue();
  });

  return Object.assign(this, {
    on: event.on.bind(event),
  }, operators);
};
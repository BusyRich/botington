const MongoClient = require('mongodb').MongoClient,
      EventEmitter = require('events');

module.exports = function(config) {
  const collections = {}, 
        operators = {},
        queue = [],
        event = new EventEmitter();

  let db;

  this.connected = false;

  const queued = function(funct, args) {
    if(db) {
      return false;
    } else {
      queue.push([funct, args]);
      return true;
    }
  };

  const runQueue = function() {
    for(var q = 0; q < queue.length; q++) {
      operators[queue[q][0]].apply(...queue[q]);
    }
  };

  const getCollection = function(name) {
    if(!collections.hasOwnProperty(name)) {
      collections[name] = db.collection(name);
    }

    return collections[name];
  };

  //For the queuing system to work, the arguments
  //are collected via rest syntax and expanded
  //when used.

  //Get operators
  operators.get = (...args) => {
    if(!queued('get', args)) {
      let [collection, query, callback] = args,
          c = getCollection(collection);

      c.findOne(query, callback);
    }
  };

  operators.getOrCreate = (...args) => {
    if(!queued('getOrCreate', args)) {
      let [collection, filter, document, callback] = args,
          c = getCollection(collection);

      c.findOneAndUpdate(filter,{
          $setOnInsert: document
        }, {
          upsert: true
        }, callback);
    }
  };

  operators.getAll = (...args) => {
    if(!queued('getAll', args)) {
      let [collection, callback] = args,
          c = getCollection(collection);

      c.find().toArray(callback);
    }
  };

  operators.getMember = (...args) => {
    if(!queued('getMember', args)) {
      let [username, callback] = args;
      operators.get('members', {username:username}, callback);
    }
  };

  //Update operators
  operators.update = (...args) => {
    if(!queued('udpate', args)) {
      let [collection, filter, update, callback] = args,
          c = getCollection(collection);

      c.updateOne(filter, update, {upsert:true}, callback);
    }
  };
  
  operators.updateMany = (...args) => {
    if(!queued('setMany', args)) {
      let [collection, filter, inField, update, callback] = args,
          c = getCollection(collection),
          op = c.initializeOrderedBulkOp();

      for(let v = 0; v < filter[inField].length; v++) {
        op.find(Object.assign({}, filter, {[inField]: filter[inField][v]}))
          .upsert()
          .updateOne(update);
      }

      op.execute(callback);
    }
  };

  operators.updateMember = (...args) => {
    if(!queued('udpateMember', args)) {
      let c = getCollection('members');
      c.updateOne(...args);
    }
  };

  operators.updateMembers = (...args) => {
    if(!queued('updateMembers', args)) {
      let [members, update, callback] = args;

      operators.updateMany('members', {username:members},
        'username', update, callback);
    }
  };

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
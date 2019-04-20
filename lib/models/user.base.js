const types = require('orum').type;

module.exports = {
  name: 'user', 
  attributes: {
    username: types.TEXT,
    online: types.JSON
  }
};
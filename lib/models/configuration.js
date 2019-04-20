const types = require('orum').type;

module.exports = {
  name: 'configuration', 
  attributes: {
    type: types.INT,
    key: types.TEXT,
    configuration: types.JSON
  }
};
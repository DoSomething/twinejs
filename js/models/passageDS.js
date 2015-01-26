'use strict';

var PassageDS = Passage.extend({
  defaults: {
    type: 'ds'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageDS.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
'use strict';

var PassageEndGameGroup = Passage.extend({
  defaults: {
    type: 'endGameGroup'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageEndGameGroup.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
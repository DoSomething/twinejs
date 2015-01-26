'use strict';

var PassageEndLevel = Passage.extend({
  defaults: {
    type: 'endLevel'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageEndLevel.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
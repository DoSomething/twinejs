'use strict';

var PassageEndLevel = Passage.extend({
  defaults: {

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
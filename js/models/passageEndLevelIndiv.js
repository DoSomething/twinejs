'use strict';

var PassageEndLevelIndiv = Passage.extend({
  defaults: {
    type: 'endLevelIndiv'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageEndLevelIndiv.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

}); 
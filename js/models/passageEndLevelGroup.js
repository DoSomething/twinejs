'use strict';

var PassageEndLevelGroup = Passage.extend({
  defaults: {
    type: 'endLevelGroup'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageEndLevelGroup.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

}); 
'use strict';

var PassageEndGameGroupSuccessNumberResult = Passage.extend({
  defaults: {
    type: 'passageEndGameGroupSuccessNumberResult'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageEndGameGroupSuccessNumberResult.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
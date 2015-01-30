'use strict';

var PassageEndGameIndivSuperlativeResult = Passage.extend({
  defaults: {
    type: 'passageEndGameIndivSuperlativeResult'
  },

  template: _.template(''),

  initialize: function() {
    console.log('passageEndGameIndivSuperlativeResult.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
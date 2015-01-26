'use strict';

var PassageEndGameIndividualSS = Passage.extend({
  defaults: {
    type: 'endGameIndividualSS'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageEndGameIndividualSS.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
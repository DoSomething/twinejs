'use strict';

var PassageEndGameIndividualBT = Passage.extend({
  defaults: {
    type: 'endGameIndividualBT'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageEndGameIndividualBT.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
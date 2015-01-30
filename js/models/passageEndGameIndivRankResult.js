'use strict';

var PassageEndGameIndivRankResult = Passage.extend({
  defaults: {
    type: 'passageEndGameIndivRankResult'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageEndGameIndivRankResult.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
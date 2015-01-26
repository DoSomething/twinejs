'use strict';

var PassageEndGameIndividualSS = Passage.extend({
  defaults: {

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
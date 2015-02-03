'use strict';

var PassageEndGameGroupSuccessNumberResult = Passage.extend({
  defaults: {
    type: 'passageEndGameGroupSuccessNumberResult',
    name: 'Endgame Group Success Number result',
    description: 'group endgame result, based on number of group success paths traversed',
    
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
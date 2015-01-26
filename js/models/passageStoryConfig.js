'use strict';

var PassageStoryConfig = Passage.extend({
  defaults: {
    type: 'storyConfig'
  },

  template: _.template(''),

  initialize: function() {
    console.log('PassageStoryConfig.initialize()');
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({});
  }

});
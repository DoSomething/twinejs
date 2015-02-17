'use strict';

var PassageEndGameGroupSuccessNumberResult = Passage.extend({
  defaults: {
    type: 'passageEndGameGroupSuccessNumberResult',
    top: 0,
    left: 0,
    name: 'Endgame Group Success Number Result',
    description: 'group endgame result message, based on the number of levels the group has successfully passed',
    text: '',
    optinpath: 0,
    // how many levels must this group have successfully passed in order for them to receive this message?
    minNumLevelSuccess: 0,
    maxNumLevelSuccess: 0
  },

  template: _.template('<tw-passagedata pid="<%- id %>" name="<%- name %>" ' +
             'type="<%- type %>" ' +
             'position="<%- left %>,<%- top %>" ' +
             'optinpath="<%- optinpath %>" ' +
             'minNumLevelSuccess="<%- minNumLevelSuccess %>" ' +
             'maxNumLevelSuccess="<%- maxNumLevelSuccess %>" ' +
             '>' +
             '<%- text %></tw-passagedata>'),

  initialize: function() {
    Passage.prototype.initialize.apply(this);
  },

  validate: function(attrs) {

  },

  publish: function(id) {
    return this.template({
      id: id,
      name: this.get('name'),
      left: this.get('left'),
      top: this.get('top'),
      text: this.get('text'),
      type: this.get('type'),
      optinpath: this.get('optinpath'),
      minNumLevelSuccess: this.get('minNumLevelSuccess'),
      maxNumLevelSuccess: this.get('maxNumLevelSuccess')
    });
  }

});
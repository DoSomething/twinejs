'use strict';

var PassageEndGameIndivRankResult = Passage.extend({
  defaults: {
    type: 'passageEndGameIndivRankResult',
    top: 0,
    left: 0,
    name: 'Endgame Individual Rank Result',
    description: 'individual endgame rank result message, based on comparing user rank with other players',
    text: '',
    optinpath: 0,
    rank: 0 // 1, 2, 3, 4, 1-tied, 2-tied
  },

  template: _.template('<tw-passagedata pid="<%- id %>" name="<%- name %>" ' +
             'type="<%- type %>" ' +
             'position="<%- left %>,<%- top %>" ' +
             'optinpath="<%- optinpath %>" ' +
             'rank="<%- rank %>" ' +
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
      optinpath: this.get('optinpath'),
      rank: this.get('rank')
    });
  }

});
'use strict';

var PassageEndLevelIndiv = Passage.extend({
  defaults: {
    type: 'passageEndLevelIndiv',
    top: 0,
    left: 0,
    name: 'end level individual results passage',
    text: '',
    optinpath: 0,
    indivSuccessPath: false,
    indivSuperlativePath: ''
  },

  template: _.template('<tw-passagedata pid="<%- id %>" name="<%- name %>" ' +
             'type="<%- type %>" ' +
             'position="<%- left %>,<%- top %>" ' +
             'optinpath="<%- optinpath %>" ' +
             'indivSuccessPath="<%- indivSuccessPath %>" ' + 
             'indivSuperlativePath="<%- indivSuperlativePath %>" ' +
             '>' +
             '<%- text %></tw-passagedata>'),

  initialize: function() {
    Passage.prototype.initialize.apply(this);
  },

  validate: function(attrs) {

  },

  /**
   * Publishes the passage to an HTML fragment.
   *
   * @param id
   *   Numeric id to assign to the passage, NOT this one's DB id
   * @return HTML fragment
   */
  publish: function(id) {
    return this.template({
      id: id,
      name: this.get('name'),
      left: this.get('left'),
      top: this.get('top'),
      text: this.get('text'),
      type: this.get('type'),
      optinpath: this.get('optinpath'),
      indivSuccessPath: this.get('indivSuccessPath'),
      indivSuperlativePath: this.get('indivSuperlativePath')
    });
  }

});
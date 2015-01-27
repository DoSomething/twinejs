'use strict';

var PassageDS = Passage.extend({
  defaults: {
    type: 'ds',
    top: 0,
    left: 0,
    name: 'Untitle DS Passage',
    text: ''
  },

  template: _.template('<tw-passagedata pid="<%- id %>" name="<%- name %>" ' +
             'type="<%- type %> ' +
             'position="<%- left %>,<%- top %>">' +
             '<%- text %></tw-passagedata>'),

  initialize: function() {
    console.log('PassageDS.initialize()');
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
      type: this.get('type')
    });
  }

});
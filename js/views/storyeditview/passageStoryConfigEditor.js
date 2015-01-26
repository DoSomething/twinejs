'use strict';

StoryEditView.PassageStoryConfigEditor = Backbone.View.extend({

  /**
   * Opens modal dialog for editing the passage.
   */
  open: function() {
    this.$el.data('modal').trigger('show');
  }

});
'use strict';

StoryEditView.PassageEndGameIndivSuperlativeResultEditor = Backbone.View.extend({

  /**
   * Opens modal dialog for editing the passage.
   */
  open: function() {
    this.$el.data('modal').trigger('show');
  },

  /**
   * Closes modal.
   */
  close: function()
  {
    this.$el.data('modal').trigger('hide');
  }

});
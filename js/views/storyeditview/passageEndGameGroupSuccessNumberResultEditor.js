'use strict';

StoryEditView.PassageEndGameGroupSuccessNumberResultEditor = Backbone.View.extend({

  initialize: function() {
    this.$el.on('modalhide', _.bind(this.save, this));
  },
  
  /**
   * Opens modal dialog for editing the passage.
   */
  open: function() {
    this.prevTitle = document.title;
    document.title = this.model.get('name');

    this.$('.passageId').val(this.model.id);
    this.$('.passageName').val(this.model.get('name'));
    var text = this.model.get('text');
    this.$('.passageText').val((text == Passage.prototype.defaults.text) ? '' : text);
    this.$('#edit-ds-oip').val(this.model.get('optinpath'));
    this.$('#edit-min-num-group-success').val(this.model.get('minNumLevelSuccess'));
    this.$('#edit-max-num-group-success').val(this.model.get('maxNumLevelSuccess'));

    this.$el.data('modal').trigger('show');

    var message = this.$('.error');
    message.css('display', 'none');
  },

  /**
   * Closes modal.
   */
  close: function()
  {
    this.$el.data('modal').trigger('hide');
  },

  /**
   * Save changes made to the model.
   *
   * @param e
   *   Event to stop
   */
  save: function(e) {
    var saveResult;
    var message = this.$('.error');

    saveResult = this.model.save({
      name: this.$('.passageName').val(),
      text: this.$('.passageText').val(),
      optinpath: this.$('#edit-ds-oip').val(),
      minNumLevelSuccess: this.$('#edit-min-num-group-success').val(),
      maxNumLevelSuccess: this.$('#edit-max-num-group-success').val()
    });

    if (saveResult) {
      this.$('.alert').remove();
      message.css('display', 'none');
    }
    else {
      var message = this.$('.error');
      message.css('display', 'block').text(this.model.validationError);
      alert(this.model.validationError);
    }

    if (e) {
      e.stopImmediatePropagation();
    }
  }

});
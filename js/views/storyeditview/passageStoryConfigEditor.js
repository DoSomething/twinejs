'use strict';

StoryEditView.PassageStoryConfigEditor = Backbone.View.extend({

  initialize: function() {
    // Save when modal is closed
    this.$el.on('modalhide', _.bind(this.save, this));
  },

  /**
   * Opens modal dialog for editing the passage.
   */
  open: function() {
    this.$('.passageId').val(this.model.id);
    this.$('.passageName').val('Story Configuration');
    this.$('#edit-sc-description').val(this.model.get('description'));
    this.$('#edit-sc-alpha-wait-oip').val(this.model.get('alpha_wait_oip'));
    this.$('#edit-sc-alpha-start-ask-oip').val(this.model.get('alpha_start_ask_oip'));
    this.$('#edit-sc-beta-join-ask-oip').val(this.model.get('beta_join_ask_oip'));
    this.$('#edit-sc-beta-wait-oip').val(this.model.get('beta_wait_oip'));
    this.$('#edit-sc-game-in-progress-oip').val(this.model.get('game_in_progress_oip'));
    this.$('#edit-sc-game-ended-from-exit-oip').val(this.model.get('game_ended_from_exit_oip'));
    this.$('#edit-sc-ask-solo-play').val(this.model.get('ask_solo_play'));
    this.$('#edit-sc-ask-beta-1-oip').val(this.model.get('mc_ask_beta_1_oip'));
    this.$('#edit-sc-ask-beta-2-oip').val(this.model.get('mc_ask_beta_2_oip'));
    this.$('#edit-sc-invalid-mobile-oip').val(this.model.get('mc_invalid_mobile_oip'));
    this.$('#edit-sc-not-enough-players-oip').val(this.model.get('mc_not_enough_players_oip'));

    this.$el.data('modal').trigger('show');
  },

  /**
   * Closes modal.
   */
  close: function() {
    this.$el.data('modal').trigger('hide');
  },

  /**
   * Save changes made to this model.
   *
   * @param {Event} e Event to stop
   */
  save: function(e) {
    var saveResult
      ;

    saveResult = this.model.save({
      name: this.$('.passageName').val(),
      description: this.$('#edit-sc-description').val(),
      alpha_wait_oip: this.$('#edit-sc-alpha-wait-oip').val(),
      alpha_start_ask_oip: this.$('#edit-sc-alpha-start-ask-oip').val(),
      beta_join_ask_oip: this.$('#edit-sc-beta-join-ask-oip').val(),
      beta_wait_oip: this.$('#edit-sc-beta-wait-oip').val(),
      game_in_progress_oip: this.$('#edit-sc-game-in-progress-oip').val(),
      game_ended_from_exit_oip: this.$('#edit-sc-game-ended-from-exit-oip').val(),
      ask_solo_play: this.$('#edit-sc-ask-solo-play').val(),
      mc_ask_beta_1_oip: this.$('#edit-sc-ask-beta-1-oip').val(),
      mc_ask_beta_2_oip: this.$('#edit-sc-ask-beta-2-oip').val(),
      mc_invalid_mobile_oip: this.$('#edit-sc-invalid-mobile-oip').val(),
      mc_not_enough_players_oip: this.$('#edit-sc-not-enough-players-oip').val()
    });

    if (saveResult) {
      this.$('.alert').remove();
    }
    else {
      // @todo show error message here
    }

    if (e) {
      e.stopImmediatePropagation();
    }
  }

});
/**
 * Library to help with importing an SMS game config from JSON to Twine data.
 */

'use strict';

var importsms = function() {

  /**
   * Import stories from a JSON string.
   *
   * @param filename
   *   Filename
   * @param strData
   *   JSON string of story data
   * @return Number of stories imported
   */
  function importStory(filename, strData) {
    var data,
        allStories,
        allPassages,
        story,
        storyConfig,
        pIndex,
        passages,
        keys,
        i;

    data = JSON.parse(strData);

    allStories = StoryCollection.all();
    allPassages = PassageCollection.all();

    // Create story object
    story = allStories.create({
      name: filename
    }, {wait: true});

    // Parse for story config object
    storyConfig = _parseForStoryConfig(data);
    storyConfig.story = story.id;
    storyConfig.left = 0;
    storyConfig.top = 0;

    allPassages.create(storyConfig, {wait: true});

    // Parse through the "story" object
    keys = Object.keys(data.story)
    for (i = 0; i < keys.length; i++) {
      passages = [];

      if (/^END-LEVEL\d+$/.test(keys[i])) {
        // END-LEVEL#
      }
      else if (/^END-LEVEL\d+-GROUP$/.test(keys[i])) {
        // END-LEVEL#-GROUP
      }
      else if (/^\d+$/.test(keys[i])) {
        // Normal DS Passage
        passages = [_parseForPassageDS(keys[i], data.story)];
      }
      else {
        // unhandled key
      }

      for (pIndex in passages) {
        passages[pIndex].story = story.id;
        allPassages.create(passages[pIndex], {wait: true});
      }
    }

    return 1;
  }

  /**
   * Compile a story config passage from the story data.
   *
   * @param data
   *   Entire story data object
   * @return object
   */
  function _parseForStoryConfig(data) {
    var passage = _copyObject(PassageStoryConfig.prototype.defaults);

    passage.description = data.__comments;
    passage.alpha_wait_oip = data.alpha_wait_oip;
    passage.alpha_start_ask_oip = data.alpha_start_ask_oip;
    passage.beta_join_ask_oip = data.beta_join_ask_oip;
    passage.beta_wait_oip = data.beta_wait_oip;
    passage.game_in_progress_oip = data.game_in_progress_oip;
    passage.game_ended_from_exit_oip = data.game_ended_from_exit_oip;
    passage.story_start_oip = data.story_start_oip;
    passage.ask_solo_play = data.ask_solo_play;

    if (typeof data.mobile_create === 'object') {
      passage.mc_ask_beta_1_oip = data.mobile_create.ask_beta_1_oip;
      passage.mc_ask_beta_2_oip = data.mobile_create.ask_beta_2_oip;
      passage.mc_invalid_mobile_oip = data.mobile_create.invalid_mobile_oip;
      passage.mc_not_enough_players_oip = data.mobile_create.not_enough_players_oip;
    }

    return passage;
  }

  /**
   * Compile a PassageDS from the story object.
   *
   * @param optinpath
   *   Story data key
   * @param storyData
   *   "story" object of imported story data
   * @return object
   */
  function _parseForPassageDS(optinpath, storyData) {
    var passage,
        answers,
        i,
        j;

    passage = _copyObject(PassageDS.prototype.defaults);

    passage.name = storyData[optinpath].name;
    passage.optinpath = optinpath;
    if (storyData[optinpath].text) {
      passage.text == storyData[optinpath].text;
    }
    else {
      for (i = 0; i < storyData[optinpath].choices.length; i++) {
        answers = '';
        for (j = 0; j < storyData[optinpath].choices[i].valid_answers.length; j++) {
          if (j > 0) {
            answers += ',';
          }

          answers += storyData[optinpath].choices[i].valid_answers[j];
        }

        passage.text += '[[placeholder text|' + storyData[optinpath].choices[i].key + '|' + answers + ']] ';
      }
    }

    return passage;
  }

  /**
   * Copy an object
   *
   * @param obj
   *   Object to copy
   * @return object
   */
  function _copyObject(obj) {
    var copy = {};
    for (var name in obj) {
      copy[name] = obj[name];
    }

    return copy;
  }

  return {
    importStory: importStory
  };
}();
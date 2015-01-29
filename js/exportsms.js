/**
 * Library to help with exporting Twine data, which typically gets published as HTML elements, and converting
 * it to a JSON string structured for use with the ds-mdata-responder app.
 */

'use strict';

var exportsms = function() {

  /**
   * Format a story from HTML elements to the JSON configuration expected for SMS games.
   *
   * @param {String} data
   *   HTML data from a published story
   * @return JSON string that defines SMS games configuration
   */
  function format(data) {
    var parsedObj,
        story,
        children,
        passage,
        tagName,
        passageType,
        i,
        j;

    var config = {},
        passages = [],
        result = {}
        ;

    parsedObj = $.parseHTML(data);
    story = parsedObj[0];
    if (story.tagName.toUpperCase() == 'TW-STORYDATA') {
      children = story.children;

      for (i = 0; i < children.length; i++) {
        // DOM element / passage data
        passage = children[i];

        // Check tag name and passage type to determine how to process this data
        tagName = passage.tagName.toUpperCase();
        passageType = passage.attributes.length > 0 ? passage.attributes.getNamedItem('type') : '';

        if (tagName == 'TW-PASSAGESTORYCONFIGDATA') {
          config = _compileStoryConfig(passage.attributes);
        }
        else if (tagName == 'TW-PASSAGEDATA' && passageType == PassageDS.prototype.defaults.type) {
          ;
        }
        else {
          // Ignore data that isn't from a custom DS passage
        }
      }
    }

    // Display resulting JSON to the screen
    result = _merge(result, config);

    return result;
  }

  /**
   * Merge obj2 into obj1.
   */
  function _merge(obj1, obj2) {
    for (var name in obj2) {
      obj1[name] = obj2[name];
    }

    return obj1;
  }

  /**
   * Process data from a story config passage to the structure expected for the SMS game config.
   *
   * @param attrs NamedNodeMap of attributes from a DOM element
   * @return Object
   */
  function _compileStoryConfig(attrs) {
    var data = {};

    data.__comments = attrs.getNamedItem('description') ? attrs.getNamedItem('description').value : '';
    data.alpha_wait_oip = attrs.getNamedItem('alpha_wait_oip') ? attrs.getNamedItem('alpha_wait_oip').value : 0;
    data.alpha_start_ask_oip = attrs.getNamedItem('alpha_start_ask_oip') ? attrs.getNamedItem('alpha_start_ask_oip').value : 0;
    data.beta_join_ask_oip = attrs.getNamedItem('beta_join_ask_oip') ? attrs.getNamedItem('beta_join_ask_oip').value : 0;
    data.beta_wait_oip = attrs.getNamedItem('beta_wait_oip') ? attrs.getNamedItem('beta_wait_oip').value : 0;
    data.game_in_progress_oip = attrs.getNamedItem('game_in_progress_oip') ? attrs.getNamedItem('game_in_progress_oip').value : 0;
    data.game_ended_from_exit_oip = attrs.getNamedItem('game_ended_from_exit_oip') ? attrs.getNamedItem('game_ended_from_exit_oip').value : 0;
    data.story_start_oip = attrs.getNamedItem('story_start_oip') ? attrs.getNamedItem('story_start_oip').value : 0;
    data.ask_solo_play = attrs.getNamedItem('ask_solo_play') ? attrs.getNamedItem('ask_solo_play').value : 0;
    data.mobile_create = {};
    data.mobile_create.ask_beta_1_oip = attrs.getNamedItem('mc_ask_beta_1_oip') ? attrs.getNamedItem('mc_ask_beta_1_oip').value : 0;
    data.mobile_create.ask_beta_2_oip = attrs.getNamedItem('mc_ask_beta_2_oip') ? attrs.getNamedItem('mc_ask_beta_2_oip').value : 0;
    data.mobile_create.invalid_mobile_oip = attrs.getNamedItem('mc_invalid_mobile_oip') ? attrs.getNamedItem('mc_invalid_mobile_oip').value : 0;
    data.mobile_create.not_enough_players_oip = attrs.getNamedItem('mc_not_enough_players_oip') ? attrs.getNamedItem('mc_not_enough_players_oip').value : 0;

    return data;
  }

  return {
    format: format
  };

}();
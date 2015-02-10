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
        passageType = passage.attributes.getNamedItem('type') ? passage.attributes.getNamedItem('type').value : '';

        if (tagName == 'TW-PASSAGESTORYCONFIGDATA') {
          config = _compileStoryConfig(passage.attributes);
        }
        else if (tagName == 'TW-PASSAGEDATA' && passageType == PassageDS.prototype.defaults.type) {
          passages.push(_compilePassage(passage));
        }
        else {
          // Ignore data that isn't from a custom DS passage
        }
      }
    }

    // Display resulting JSON to the screen
    result = _merge(result, config);
    result = _merge(result, _buildStory(passages));

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
   * Helper function to create a position object from a string.
   *
   * @param coordinates
   *   String coordinates {left,top}
   * @return object
   */
  function _getPositionFromString(coordinates) {
    var pos = {top: 0, left: 0};
    var comma = 0;

    if (typeof coordinates === 'string') {
      comma = coordinates.indexOf(',');
      pos.left = coordinates.substring(0, comma);
      pos.top = coordinates.substring(comma + 1);
    }

    return pos;
  }

  /**
   * Process data from a story config passage to the structure expected for the SMS game config.
   *
   * @param attrs NamedNodeMap of attributes from a DOM element
   * @return Object
   */
  function _compileStoryConfig(attrs) {
    var pos,
        strPos,
        data = {};

    data.__comments               = attrs.getNamedItem('description') ? attrs.getNamedItem('description').value : '';
    data.alpha_wait_oip           = attrs.getNamedItem('alpha_wait_oip') ? attrs.getNamedItem('alpha_wait_oip').value : 0;
    data.alpha_start_ask_oip      = attrs.getNamedItem('alpha_start_ask_oip') ? attrs.getNamedItem('alpha_start_ask_oip').value : 0;
    data.beta_join_ask_oip        = attrs.getNamedItem('beta_join_ask_oip') ? attrs.getNamedItem('beta_join_ask_oip').value : 0;
    data.beta_wait_oip            = attrs.getNamedItem('beta_wait_oip') ? attrs.getNamedItem('beta_wait_oip').value : 0;
    data.game_in_progress_oip     = attrs.getNamedItem('game_in_progress_oip') ? attrs.getNamedItem('game_in_progress_oip').value : 0;
    data.game_ended_from_exit_oip = attrs.getNamedItem('game_ended_from_exit_oip') ? attrs.getNamedItem('game_ended_from_exit_oip').value : 0;
    data.story_start_oip          = attrs.getNamedItem('story_start_oip') ? attrs.getNamedItem('story_start_oip').value : 0;
    data.ask_solo_play            = attrs.getNamedItem('ask_solo_play') ? attrs.getNamedItem('ask_solo_play').value : 0;
    data.mobile_create = {};
    data.mobile_create.ask_beta_1_oip         = attrs.getNamedItem('mc_ask_beta_1_oip') ? attrs.getNamedItem('mc_ask_beta_1_oip').value : 0;
    data.mobile_create.ask_beta_2_oip         = attrs.getNamedItem('mc_ask_beta_2_oip') ? attrs.getNamedItem('mc_ask_beta_2_oip').value : 0;
    data.mobile_create.invalid_mobile_oip     = attrs.getNamedItem('mc_invalid_mobile_oip') ? attrs.getNamedItem('mc_invalid_mobile_oip').value : 0;
    data.mobile_create.not_enough_players_oip = attrs.getNamedItem('mc_not_enough_players_oip') ? attrs.getNamedItem('mc_not_enough_players_oip').value : 0;

    strPos = attrs.getNamedItem('position') ? attrs.getNamedItem('position').value : '0,0';
    pos = _getPositionFromString(strPos);

    data._twinedata = {
      storyconfig: {
        pos: {
          top: pos.top,
          left: pos.left
        }
      }
    };

    return data;
  }

  /**
   * Get passage data out of passage elements and return as an object with just the info we need.
   *
   * @param passage
   *   Passage data as an HTML tw-passagedata element
   * @return Object
   */
  function _compilePassage(passage) {
    var pos, strPos;
    var data = {};
    var attrs = passage.attributes;

    data.optinpath = attrs.getNamedItem('optinpath') ? attrs.getNamedItem('optinpath').value : 0;
    data.name = attrs.getNamedItem('name') ? attrs.getNamedItem('name').value : '';
    data.text = passage.innerText.trim();

    strPos = attrs.getNamedItem('position') ? attrs.getNamedItem('position').value : '0,0';
    pos = _getPositionFromString(strPos);
    data.top = pos.top;
    data.left = pos.left;

    return data;
  }

  /**
   * Build story config out of an array of passage data.
   *
   * @param passages
   *   Array of passages in the story
   * @return Story object
   */
  function _buildStory(passages) {
    var story,
        storyPassage,
        passage,
        optinpath,
        key,
        links,
        answers,
        next,
        error,
        i,
        j,
        k;

    story = {};
    for (i = 0; i < passages.length; i++) {
      passage = passages[i];
      if (typeof story[passage.optinpath.toString()] === 'undefined') {
        storyPassage = {};
        storyPassage.name = passage.name;
        storyPassage.choices = [];

        // Find links in the text
        links = passage.text.match(/\[\[.*?\]\]/g);

        for (j = 0; links != null && j < links.length; j++) {
          // Assumes link format is [[display text|link|valid answers]]
          key = links[j].replace(/\[\[(.+)\|(.+)\|(.+)\]\]/g, '$2');
          answers = links[j].replace(/\[\[(.+)\|(.+)\|(.+)\]\]/g, '$3');
          next = 0;

          // Build the choices array based on the links found
          storyPassage.choices[j] = {};
          storyPassage.choices[j].key = key;
          storyPassage.choices[j].valid_answers = [answers];

          // To get the `next` optinpath, search through all passages to find the
          // passage.name that matches the key for this choice.
          for (k = 0; k < passages.length; k++) {
            if (passages[k].name == key) {
              next = passages[k].optinpath;
              break;
            }
          }

          storyPassage.choices[j].next = next;
          if (next == 0) {
            error = 'Next opt-in path not found for passage: ' + passage.name;
            console.log(error);
          }
        }

        // Store twine data to allow story to be imported properly
        storyPassage._twinedata = {
          pos: {
            top: passage.top,
            left: passage.left
          }
        };

        // Add passage to the story with optinpath as its key
        story[passage.optinpath.toString()] = storyPassage;
      }
      else {
        error = 'Warning - multiple passages with the same optinpath';
        console.log(error);
      }
    }

    return {'story': story};
  }

  return {
    format: format
  };

}();
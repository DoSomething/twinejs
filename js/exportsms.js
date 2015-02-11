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
        passageData,
        configData,
        tagName,
        passageType,
        i,
        j;

    var config = {},
        regularLevelData = [],
        endLevelData = [],
        endGameData = [],
        result = {};

    parsedObj = $.parseHTML(data);
    story = parsedObj[0];
    if (story.tagName.toUpperCase() == 'TW-STORYDATA') {
      children = story.children;

      for (i = 0; i < children.length; i++) {
        // DOM element / passage data
        passage = children[i];
        passageData = _extractHTMLData(passage);

        // Check tag name and passage type to determine how to process this data
        tagName = passage.tagName.toUpperCase();
        passageType = passageData.type;

        if (tagName == 'TW-PASSAGESTORYCONFIGDATA') {
          configData = passageData;
        }
        else if (tagName == 'TW-PASSAGEDATA') {
          if (passageType == PassageDS.prototype.defaults.type) {
            regularLevelData.push(passageData);
          }
          else if (passageType == PassageEndLevelIndiv.prototype.defaults.type || 
                   passageType == PassageEndLevelGroup.prototype.defaults.type) {
            endLevelData.push(passageData);
          }
          else if (passageType == PassageEndGameIndivRankResult.prototype.defaults.type || 
                   passageType == PassageEndGameIndivSuperlativeResult.prototype.defaults.type || 
                   passageType == PassageEndGameGroupSuccessNumberResult.prototype.defaults.type) {
            endGameData.push(passageData);
          }
        }
        else {
          // Ignore data that isn't from a custom DS passage
        }
      }
    }

    // Combine JSON objects into config object.
    result = _merge(_buildRegularLevels(regularLevelData), _buildEndLevels(endLevelData));
    result = _merge(result, _buildEndGame(endGameData));
    result = { story: result }
    result = _merge(result, _buildStoryConfig(configData));

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
   * Get passage data out of passage elements and return as an object with just the info we need.
   *
   * @param passage
   *   Passage data as an HTML tw-passagedata element
   * @return Object
   */
  function _extractHTMLData(passage) {
    var data = {}
      , attrs = passage.attributes
      , i
      ; 

    for (i = 0; i < attrs.length; i ++) {
      var attrName = attrs[i].name || 'undefinedAttribute' + i;
      data[attrName] = attrs[i].value || 0;
    }

    data.text = passage.innerText.trim(); // Is this still necessary? 

    pos = _getPositionFromString(data.position);
    data._twinedata = {
      pos: {
        top: pos.top,
        left: pos.left
      },
      text: passage.innerText.trim();
    }

    return data;
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
  function _buildStoryConfig(passageData) {
    var data = {};

    data.__comments               = passageData.description || '';
    data.alpha_wait_oip           = passageData.alpha_wait_oip || 0;
    data.alpha_start_ask_oip      = passageData.alpha_start_ask_oip || 0;
    data.beta_join_ask_oip        = passageData.beta_join_ask_oip || 0;
    data.beta_wait_oip            = passageData.beta_wait_oip || 0;
    data.game_in_progress_oip     = passageData.game_in_progress_oip || 0;
    data.game_ended_from_exit_oip = passageData.game_ended_from_exit_oip || 0;
    data.story_start_oip          = passageData.story_start_oip || 0;
    data.ask_solo_play            = passageData.ask_solo_play || 0;

    data.mobile_create = {};
    data.mobile_create.ask_beta_1_oip         = passageData.mc_ask_beta_1_oip || 0;
    data.mobile_create.ask_beta_2_oip         = passageData.mc_ask_beta_2_oip || 0;
    data.mobile_create.invalid_mobile_oip     = passageData.mc_invalid_mobile_oip || 0;
    data.mobile_create.not_enough_players_oip = passageData.mc_not_enough_players_oip || 0;
    data._twinedata                           = passageData._twinedata;

    strPos = attrs.getNamedItem('position') ? attrs.getNamedItem('position').value : '0,0';
    pos = _getPositionFromString(strPos);
    data.top = pos.top;
    data.left = pos.left;

    return data;
  }

  /**
   * Assemble the game configuration document's normal level objects 
   * (NOT end-level, or end-game) out of an array of passage data objects.
   *
   * @param passageData
   *   Array of passageData
   * @return partialStory
   *   Object of normal level configuration objects. 
   */
  function _buildRegularLevels(passageData) {
    var partialStory,
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

    partialStory = {};
    for (i = 0; i < passageData.length; i++) {
      passage = passageData[i];
      // If the partialStory object doesn't already have the passage with this opt in path, then add it. 
      if (typeof partialStory[passage.optinpath.toString()] === 'undefined') {
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

          // To get the `next` optinpath, search through all passageData to find the
          // passage.name that matches the key for this choice.
          for (k = 0; k < passageData.length; k++) {
            if (passageData[k].name == key) {
              next = passageData[k].optinpath;
              break;
            }
          }

          storyPassage.choices[j].next = next;
          if (next == 0) {
            error = 'Next opt-in path not found for passage: ' + passage.name;
            console.log(error);
          }
        }

        // Store twine spatial and text data to allow story to be imported properly
        storyPassage._twinedata = passage._twinedata

        partialStory[passage.optinpath.toString()] = storyPassage;
      }
      else {
        error = 'Warning - multiple passageData with the same optinpath';
        alert(error);
      }
    }

    return partialStory;
  }

  /**
   * Assemble the game configuration document's end-level objects 
   * out of an array of passage data objects.
   *
   * @param passageData
   *   Array of passageData
   * @return Story
   *   Object of end-level configuration objects. 
   */
  function _buildEndLevels(endLevelData) {
    return {};
  }

  /**
   * Assemble configuration objects out of an array of passage data.
   *
   * @param passages
   *   Array of passages in the story
   * @return Story object
   */
  function _buildEndGame(endGameData) {
    return {};
  }

  return {
    format: format
  };

}();
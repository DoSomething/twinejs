/**
 * Library to help with exporting Twine data, which typically gets published as HTML elements, and converting
 * it to a JSON string structured for use with the ds-mdata-responder app.
 */

'use strict';

var TOTAL_NUMBER_OF_LEVELS = 6;

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

    config = _buildRegularLevels(regularLevelData, config);
    config = _buildEndLevels(endLevelData, config);
    config = _buildEndGame(endGameData, config);
    return config;
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
      , pos
      ; 

    for (i = 0; i < attrs.length; i ++) {
      var attrName = attrs[i].name || 'undefinedAttribute' + i;
      data[attrName] = attrs[i].value || 0;
    }

    data.text = passage.innerText.trim();

    pos = _getPositionFromString(data.position);
    data._twinedata = {
      pos: {
        top: pos.top,
        left: pos.left
      },
      text: passage.innerText.trim()
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

    return data;
  }

  /**
   * Assemble the game configuration document's normal level objects 
   * (NOT end-level, or end-game) out of an array of passage data objects.
   *
   * @param passageData
   *   Array of passageData
   * @param config
   *   Unfinished config object we're in the process of building. 
   * @return partialStory
   *   Object of normal level configuration objects. 
   */
  function _buildRegularLevels(passageData, config) {
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


    if (config.story) {
      partialStory = config.story;
    } 
    else {
      partialStory = {};
    }

    for (i = 0; i < passageData.length; i++) {
      passage = passageData[i];
      // If the partialStory object doesn't already have the passage with this opt in path, then add it. 
      if (typeof partialStory[passage.optinpath.toString()] === 'undefined') {
        storyPassage = {};
        storyPassage.key = passage.name;
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

    config.story = partialStory;

    return config;
  }

  /**
   * Assemble the game configuration document's end-level objects 
   * out of an array of passage data objects.
   *
   * @param passageData
   *   Array of passageData
   * @param config
   *   Unfinished config object we're in the process of building. 
   * @return Story
   *   Object of end-level configuration objects. 
   */
  function _buildEndLevels(endLevelData, config) {
    var i, 
        j,
        k,
        endLevelOutcome, 
        partialStory,
        passageDatum,
        levelNumber,
        configObject,
        resultObject,
        nameString,
        endLevelGroupLink,
        endLevelGroupKey,
        endLevelGroupSuccessFailureStatus,
        endLevelGroupConfigObject,
        choice,
        nextLevelString,
        nextLevelLink,
        nextLevelKey,
        nextLevelNumber,
        storyNode,
        keyArray,
        testKey
        ;

    if (config.story) {
      partialStory = config.story;
    } 
    else {
      partialStory = {};
    }

    for (i = 0; i < endLevelData.length; i++) {
      passageDatum = endLevelData[i]
      levelNumber = passageDatum.name.match(/\d+/)[0] // Returns first number that appears in string.

      // If this passageDatum is data from an individual end-level result passage
      if (passageDatum.type == PassageEndLevelIndiv.prototype.defaults.type) {
        nameString = "END-LEVEL" + levelNumber;
        configObject = (partialStory[nameString] || { "choices": [] })

        resultObject = {
          "next" : parseInt(passageDatum.optinpath, 10),
          "conditions" : {
            "$and": [
              passageDatum.name
            ]
          }
        }

        // Inserting this passageDatum's choice set information into the `choices` array of an `END-LEVELX` object.
        configObject.choices.push(resultObject);
        // And then, (re)inserting the `END-LEVELX` object into the partialStory object. 
        partialStory[nameString] = configObject;

        // For this END-LEVELX individual result, we're finding which END-LEVELX-GROUP result (SUCCESS or FAILURE) 
        // it's linked to (and can produce), and adding the key of the individual result to the 'conditions' object of 
        // that particular group result. OIP of that choice result will be populated when that group result passage is parsed. 
        endLevelGroupLink = passageDatum.text.match(/\[\[.*?\]\]/g)[0];
        endLevelGroupKey = endLevelGroupLink.replace(/\[\[(.+)\|(.+)\|(.+)\]\]/g, '$2');
        endLevelGroupSuccessFailureStatus = endLevelGroupLink.toUpperCase().match(/(SUCCESS|FAILURE)/g)[0];
        endLevelGroupConfigObject = (partialStory[nameString + "-GROUP"] || { "choices" : [ {"flag": "SUCCESS"}, {"flag": "FAILURE"} ], "next_level": 0 });

        for (j = 0; j < endLevelGroupConfigObject.choices.length; j ++) {
          choice = endLevelGroupConfigObject.choices[j];
          // Matching the link contained within the end-level-individual passage to either the 'SUCCESS' or 'FAILURE' 
          // END-LEVELX-GROUP choices
          if (endLevelGroupSuccessFailureStatus == choice.flag.toUpperCase()) {
            if (!choice.conditions){
              choice.conditions = { "$or" : [] };
            }
            choice.conditions["$or"].push(passageDatum.name);
            partialStory[nameString + "-GROUP"] = endLevelGroupConfigObject;
            break;
          }
        }

      }
      // If this passageDatum is data from a group end-level result passage
      else if (passageDatum.type == PassageEndLevelGroup.prototype.defaults.type) {
        nameString = "END-LEVEL" + levelNumber + "-GROUP";
        configObject = (partialStory[nameString] || { "choices" : [ {"flag": "SUCCESS"}, {"flag": "FAILURE"} ], "next_level": 0 });
        endLevelGroupSuccessFailureStatus = passageDatum.name.toUpperCase().match(/(SUCCESS|FAILURE)/g)[0];
        console.log(endLevelGroupSuccessFailureStatus, 'endLevelGroupSuccessFailureStatus')

        for (j = 0; j < configObject.choices.length; j ++) {
          choice = configObject.choices[j];
          if (endLevelGroupSuccessFailureStatus == choice.flag.toUpperCase() && !choice.next) {
            choice.next = parseInt(passageDatum.optinpath, 10);
            break;
          }
        }

        nextLevelNumber = parseInt(levelNumber, 10) + 1;
        if (nextLevelNumber <= TOTAL_NUMBER_OF_LEVELS) {
          nextLevelString = 'L' + nextLevelNumber + '0';
          for (storyNode in config.story) {
            // Implementing a best practice: when iterating through an object's properties, it's possible to include inherited properties. We check with .hasOwnProperty
            if (config.story.hasOwnProperty(storyNode) && config.story[storyNode].key == nextLevelString) {
              keyArray = Object.keys(config.story);
              for (k = 0; k < keyArray.length; k ++) {
                testKey = keyArray[k];
                if (config.story[testKey].key == nextLevelString) {
                  configObject.next_level = keyArray[k];
                  break;
                }
              }
            }
          }
        } else {
          configObject.next_level = 'END-GAME';
        }

        partialStory[nameString] = configObject;
      }
    }
    config.story = partialStory;
    return config;
  }

  /**
   * Assemble configuration objects out of an array of passage data.
   *
   * @param passages
   *   Array of passages in the story
   * @param config
   *   Unfinished config object we're in the process of building. 
   * @return Story object
   */
  function _buildEndGame(endGameData, config) {
    return config;
  }

  return {
    format: format
  };

}();
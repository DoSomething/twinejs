/**
 A collection of passages.

 @class PassageCollection
 @extends Backbone.Collection
**/

'use strict';

var PassageCollection = Backbone.Collection.extend(
{
  /**
   * Collection contains polymorphic models.
   */
  model: function(attrs, options) {
    if (attrs.type === PassageStoryConfig.prototype.defaults.type) {
      return new PassageStoryConfig(attrs, options);
    }
    else if (attrs.type === PassageDS.prototype.defaults.type) {
      return new PassageDS(attrs, options);
    }
    else if (attrs.type === PassageEndLevelIndiv.prototype.defaults.type) {
      return new PassageEndLevelIndiv(attrs, options);
    }
    else if (attrs.type === PassageEndLevelGroup.prototype.defaults.type) {
      return new PassageEndLevelGroup(attrs, options);
    }
    else if (attrs.type === PassageEndGameIndivSuperlativeResult.prototype.defaults.type) {
      return new PassageEndGameIndivSuperlativeResult(attrs, options);
    }
    else if (attrs.type === PassageEndGameGroupSuccessNumberResult.prototype.defaults.type) {
      return new PassageEndGameGroupSuccessNumberResult(attrs, options);
    }
    else if (attrs.type === PassageEndGameIndivRankResult.prototype.defaults.type) {
      return new PassageEndGameIndivRankResult(attrs, options);
    }
    else {
      return new Passage(attrs, options);
    }
  },

  localStorage: new Backbone.LocalStorage('twine-passages')
});

/**
 Returns a collection of all passages saved.

 @method all
 @return {PassageCollection} a collection of all passages
 @static
**/

PassageCollection.all = function()
{
  var result = new PassageCollection();
  result.fetch();
  return result;
};

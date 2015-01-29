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

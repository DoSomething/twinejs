var autoImportFile = function(){
  $.get(window.location.pathname + 'preload/' + PRELOADED_STORY_FILENAME, function(response) {
    var preloadHasLoaded = false;
    StoryCollection.all().each(function(story){
      if (story.attributes.name == PRELOADED_STORY_NAME) {
        preloadHasLoaded = true;
      }
    })

    if (!preloadHasLoaded){
      window.app.importFile(response);
    }
  })
}

$.ready(autoImportFile());
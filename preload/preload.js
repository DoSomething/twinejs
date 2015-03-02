var autoImportFiles = function(){
  var i,
      file,
      preloadHasLoaded;
  for (i = 0; i < PRELOADS.length; i++){
    file = PRELOADS[i];
    preloadHasLoaded = false;
    $.get(window.location.pathname + 'preload/' + file.filename, function(response) {
      StoryCollection.all().each(function(story){
        if (story.attributes.name == file.name) {
          preloadHasLoaded = true;
        }
      })

      if (!preloadHasLoaded){
        window.app.importFile(response);
      }
    }) 
  }
}

$.ready(autoImportFiles());
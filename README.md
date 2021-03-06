Intertwine
-------

### SYNOPSIS

Intertwine is a modification of [Twine.js](https://bitbucket.org/klembot/twinejs), 
the wonderful interactive fiction game creation tool created by Chris Klimas, Leon 
Arnott, Daithi O Crualaoich, Ingrid Cheung, Thomas Michael Edwards, Micah Fitch, 
Juhana Leinonen, and Ross Smith. Many thanks to all of them!

### INSTALLATION

Run `npm install` at the top level of the directory to install all goodies.

You need [Grunt](http://gruntjs.com) to continue. Run `npm install -g grunt-cli`
(you need to have root privileges to achieve this task)

### BUILDING

Run `grunt` to perform a basic build, including creating documentation in doc/;
`grunt watch` will perform the same tasks whenever you make changes to the
source code. `grunt release` will minify everything to as few files as possible
into dist/.

### TESTING

This uses [Selenium IDE](http://docs.seleniumhq.org/projects/ide/) for
automated browser testing. Unfortunately, Selenium IDE does not like running on
the file:// protocol because of JavaScript security restrictions. To facilitate
testing, run `grunt server`, which will spin up a basic web server on port
8000.

### CREATING A GAME
For game creation information, check out [this repo's wiki](../../wiki). 
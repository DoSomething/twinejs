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
1. In order to create a game, click on `blank_game_template (sci sleu format)` on the home screen. 
A few notes: 

  * The game has the science sleuth endgame format, where a user receives 2 endgame messages--first, a message based on whether or not the group has solved the mystery (founded on an aggregate of all player choices) and second, a message based on what rank the individual has earned within the group (comparing the individual's number of correct choices to those of other players.) 

  * The game is a blank template. When you open up the game, you'll notice that most of the passages are yellow--this is to signify that an opt-in-path hasn't been entered for that passage yet. 

  * Add new nodes by clicking the bottom-right-hand-corner `Add Node` button. 

2. Use the game campaign you've created in Mobile Commons to populate the **Story Configuration** passage card at the top of the page.

3. Aside from the Story Configuration passage, all the other passage cards **represent a message that is actually sent to the user.** We'll refer to these as "passage cards" or "passage nodes". Note that because of their titles, **each passage node also represents a choice made by the user.** So the last character in each passage’s “name” or “key” is the response the user provides in order to get to that passage. For instance, a user texts “B” at “L10” in order to get to a passage named "L1B", and texts "A" at "L1B" to arrive at "L1BA". Hence, it's important to make sure that one passage's written links correspond to the name of the passage you want to link it to. (It'll be obvious, though, if a passage isn't connected to anything--there won't be a line coming from it or going to it.) 

4. For each passage node, fill in a few things: 
  
  1. The title of the card. This will be filled out for you already, if you're using the blank science sleuth game template. Note that the syntax, something like "L1AB", signifies "L" for level, "1" for level number, "A" for the first choice the user made in the level to arrive at that passage node, and "B" for the second choice the user made to arrive at that passage node". If passage L1A links to passage L1AB, note that the name L1AB is used in the link written in L1AB to connect them. More on links below. 

  2. The Mobile Commons opt-in-path for that message. This can be pulled from Mobile Commons. 

  3. The text of the message sent to the user, inputted in the bottom field. 

  4. The link(s) to the passage node(s) the passage connects to. These links are written in this syntax: `[[text of passage link | exact name of passage to be linked to]]`. Note that the `text of passage link` parameter is arbitrary, and has no bearing on the game configuration itself--it only serves to improve the readability of the link, and is useful only to the play-through value of the Intertwine game. 

  5. (PRESENT IN INDIVIDUAL END-LEVEL PASSAGES) "Is this an individual success path?" By default, this input field will be `false`. If this passage node represents a "success" choice for an individual player, write `true` here. This will be used to calculate what Science Sleuth -style individual player ranking endgame messages the player receives. This field should not be populated if the game has a Bully Text -style individual superlative endgame style. 

  6. (PRESENT IN INDIVIDUAL END-LEVEL PASSAGES) "What individual endgame superlative result does this path produce? (comma-separated)" By default, this input field will be empty. If the user needs to make the choices which lead to this message in order to receive a specific superlative, write the flag (name) of that superlative in this field. This field should be populated with the name of the flag which corresponds to the specific endgame result. If this passage node corresponds to multiple superlative results, put the names of all the flags in this field, separated by commas. This will be used to calculate what Bully Text -style individual player superlative results the player receives. This field should not be populated if the game has a Science Sleuth -style individual superlative endgame style. 

  7. (PRESENT IN GROUP END-LEVEL PASSAGES) "Is this a group success path?" If this passage node corresponds to a message which groups receive when they are successful in a level, write `true` here. Otherwise, write `false`. This parameter is used to calculate Science Sleuth -style endgame group success/failure messages. 

5. Populate the end game passages. Note that the old rule still holds here--all the end game passages each correspond to a message the user can receive. For the "blank_game_template (sci sleu format) game", the game will already feature endgame nodes which correspond to the Science Sleuth endgame style--receiving a message that indicates whether or not the group has won or lost, as well as receiving a message that indicates the user's rank. In order to change the endgame format to the Bully Text format, remove the last nine endgame nodes. Replace them with however many "End Game Result, Indiv Superlative (BT)" passage nodes as there are different superlatives to be awarded. 

6. There are three types of end game passages, each corresponding to a different type of message the user can receive at the endgame, each taking different parameters: 

  1. **Endgame Result, Group Success Number**: the passage node which corresponds to a particular endgame group success number result, specific to the Science Sleuth format. In other words, based on the number of level successes the group achieves, they receive one of these messages. Hence, in addition to the usual passage params, we have some new fields, which are pretty self-explanatory: 
    1. `What's the MINIMUM number of levels the players must have successfully passed in order for them to receive this message?` Enter an integer. 
    2. `What's the MAXIMUM number of levels the players must have successfully passed in order for them to receive this message?` Enter an integer. 
 
  2. **Endgame Result, Indiv Ranking (SS)**: the passage node which corresponds to a particular endgame group individual ranking result, specific to the Science Sleuth format. Based on how well the individual performs in the game (the number of individual success levels she passes, indicated by the `Is this an individual success path?` param in group end level passage nodes), she receives one of these endgame result messages at the end of the game. In addition to usual passage params, we have new fields, which are also self-explanatory: 
    1. `How must the user be ranked relative to her peer players in order to receive this result message?` Enter an integer: `1, 2, 3, 4`, or `1-tied` (for tied for first) or `2-tied` (for tied for second.) 

  3. **Endgame Result, Indiv Superlative (BT)**: the passage node which corresponds to a particular superlative endgame message the user can receive in a given endgame situation, specific to the Bully-Text format. Remember when we added superlative flags to the `What individual endgame superlative result does this path produce (comma-separated)` param in end-level passage nodes? Each superlative flag name should correspond to one of these "Endgame Result, Indiv Superlative (BT)" passages, which in addition to the title of the passage, MC opt-in path, and body text, has another param: 
    1. `What is the name of the flag which marks paths corresponding to this result message?`: here, put the name(s) of the superlative flags which correspond to the user receiving this message.

### SAVING A GAME

When you've created a game in your browser, that game is stored in the local memory of your personal machine, **NOT** in cloud storage accessible across machines or browsers. 

This means that in order to create an Intertwine game on one machine and edit it on another, it's important to first publish the story as an HTML file on one machine, save it, and import that HTML file on the machine you'd like to edit it on. 

![How to export (publish) an Intertwine file. ](http://i34.photobucket.com/albums/d147/Tong_Xiang/Screenshot%202015-03-30%2017.04.19_zpsib4yx1af.png "How to export (publish to HTML) an Intertwine file.")

### IMPORTING A GAME
On the home page, click *Import From File* button the the right side of the screen. Choose an HTML intertwine file--for instance, one that you just exported and saved to your machine, and then import it. 

![How to import an Intertwine file.](http://i34.photobucket.com/albums/d147/Tong_Xiang/Screenshot%202015-03-31%2010.22.12_zpsosukiepi.png)

### PLAYING THROUGH A GAME
Click the `Play` button in the bottom right hand corner, or from the home screen, click the triangular play button under the story you'd like to play. Click through the story's links to see the progression of messages the user would receive. 

### EXPORTING TO OUR RESPONDER
After we've created a game in Intertwine, we still need to create the JSON config file and upload it to the ds-mdata-responder. 

1. **Export to SMS**--once we've completed the game, we first need to export the game to JSON. Within the game edit view, click the button in the bottom left-hand corner, next to the home icon. Then click `Export for SMS`.

![How to export an Intertwine file's JSON config file.](http://i34.photobucket.com/albums/d147/Tong_Xiang/Screenshot%202015-03-31%2014.39.18_zpso2dxqs3k.png)

2. This opens a new browser window. Copy this JSON file. 

3. Within the mdata-responder-deployment's config database, create a new document within the competitive_stories collection. Paste this JSON file into this new document. You're done!
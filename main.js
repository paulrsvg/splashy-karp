 //splashy karp - a flappy bird clone made w/ phaser

//based off of this tutorial: http://www.lessmilk.com/tutorial/flappy-bird-phaser-1




// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 

        // Change the background color of the game to blue
        //game.stage.backgroundColor = '#71c5cf'- tealish ,#6860f8 - surf blue, #94bdff - intro blue
        game.stage.backgroundColor = '#94bdff';
        //load bird sprite - 
       //var bird_sprite = 'https://cdn.glitch.com/ebeead0c-28e7-4aac-9cea-1e3e639abaa3%2Fkarp.png?1558076253481'
       //var pipe_sprite = 'https://cdn.glitch.com/ebeead0c-28e7-4aac-9cea-1e3e639abaa3%2Fwhirlpool.png?1558076253559'
        //game.load.image('bird', bird_sprite ); //here we use a fish sprite from pkmn gold
        //game.load.image('pipe',  pipe_sprite); //and the whirlpool from pkmn gold as the obstacle block

      
      // Here we preload the image assets - make more here http://piskelapp.com
 
      
      //
      
      var sprite = "//cdn.glitch.com/bab20fc1-f1c8-4cea-be3a-ba6b02b4e63f%2Fplayer.png?1536480377832";
      //preload img sprites w/ cross origin anonymous bc CDN
       
      game.load.crossOrigin = 'anonymous';
      //here we use a fish sprite from pkmn gold
      game.load.image('bird','https://cdn.glitch.com/ebeead0c-28e7-4aac-9cea-1e3e639abaa3%2Fkarp.png?1558076253481');
      //and the whirlpool from pkmn gold as the obstacle block
      game.load.image('pipe','https://cdn.glitch.com/ebeead0c-28e7-4aac-9cea-1e3e639abaa3%2Fwhirlpool.png?1558076253559'); 

      
        //some sounds if you want.
        //game.load.audio('jump', 'https://cdn.glitch.com/ebeead0c-28e7-4aac-9cea-1e3e639abaa3%2Fjump.wav?1558076253538');
    },

    create: function() { 
        
        //add sound on jump
        //this.jumpSound = game.add.audio('jump'); 

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);


        //pipe.scale.setTo(32, 32);
        //bird.scale.setTo(32, 32);

        // Create an empty group
        this.pipes = game.add.group(); 
        //add pipes every 1.5s
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 
        
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "score: " + this.score, 
        { font: "30px Arial", fill: "#ffffff" });  

      
      
      

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');
        //scale size up from the small png
        this.bird.scale.setTo(1.5,1.5);

         // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5); 
        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 950;  

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);  
      
      
      
      
      //add for mobile?
        //game.input.activePointer.isDown.add(this.jump, this);
      
      
      //game.input.activePointer.isDown.add(this.jump, this);
    },

    update: function() {
      
      //add for mobile - touch to jump
      if (game.input.activePointer.isDown) {
        this.jump();
      }
      
      
        // This function is called 60 times per second    
        // It contains the game's logic  
        if (this.bird.angle < 20)
            this.bird.angle += 1; 
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);  

        if (this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();

        game.physics.arcade.overlap(
            this.bird, this.pipes, this.restartGame, null, this);
    },


  
    // Make the bird jump 
    jump: function() {
        //play snd on jmp
        //this.jumpSound.play();
        
        //don't jump when dead
        if (this.bird.alive == false)
        return;  
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -300;// og: 350, 250 is less jumpy but they need to jump more, little easier,  300- is slower to press
      //faster sounds more like a splashy karp to me, 450 is mad splaaashy, -320 is pretty good, almost too easy tho.
      
      //make the 20 attainable

        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start(); 

        //or in 1 line
        //game.add.tween(this.bird).to({angle: -20}, 100).start(); 
    },


    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');
        //scale up png of sprite
        pipe.scale.setTo(3,3);
    
        // Add the pipe to our previously created group
        this.pipes.add(pipe);
    
        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);
    
        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
    
        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function() {
        this.score += 1;
        this.labelScore.text = `score: ${this.score}`;  


        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;
    
        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);   
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;
    
        // Set the alive property of the bird to false
        this.bird.alive = false;
    
        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },


    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

};



// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');



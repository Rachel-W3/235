WebFont.load({
    google: {
      families: ['Press Start 2P']
    },
    active:e=>{
    	console.log("font loaded!");
    	// pre-load the images
		PIXI.loader.
		add(["images/Spaceship.png","images/explosions.png"]).
		on("progress",e=>{console.log(`progress=${e.progress}`)}).
		load(setup);
    }
});
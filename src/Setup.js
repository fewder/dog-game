PhaserGame.states.Setup = function (game) {};

PhaserGame.states.Setup.prototype = {
	init: function () {
		this.setupStates();
		this.setupObjects();
		this.setupDisplay();
		this.setupInput();
	},

	setupStates: function () {
		for (state_name in PhaserGame.states) {
			this.game.state.add(state_name, PhaserGame.states[state_name]);
		}
	},

	setupObjects: function () {
		for (object_name in PhaserGame.objects) {
			Phaser.GameObjectFactory.prototype[object_name] = function (constructor) {
				return function (x, y, data, group) {
					if (group === undefined) { group = this.world; }
					return group.add(new constructor(this.game, x, y, data, group));
				};
			}(PhaserGame.objects[object_name]);

			Phaser.GameObjectCreator.prototype[object_name] = function (constructor) {
				return function (x, y, data, group) {
					return new constructor(this.game, x, y, data, group);
				};
			}(PhaserGame.objects[object_name]);
		}
	},

	setupDisplay: function () {
		if (this.game.device.desktop) {
			// If you have any desktop specific settings, they can go in here
			this.game.scale.pageAlignHorizontally = true;
		} else {
			// Same goes for mobile settings.
			// In this case we're saying 'scale the game, no lower than 480x260 and no higher than 1024x768'
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.setMinMax(480, 360, 800, 600);
			this.game.scale.forceLandscape = true;
			this.game.scale.pageAlignHorizontally = true;
		}
	},

	setupInput: function () {
		// Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
		this.game.input.maxPointers = 1;

		this.game.input.mouse.capture = true;

		this.stage.disableVisibilityChange = true;

		// mouse locking
		//var state = this; this.game.canvas.addEventListener('mousedown', function() { state.game.input.mouse.requestPointerLock(); });
	},

	preload: function () {
		// Here we preload the loading bar asset required for our main loader
		//this.game.load.image('loading_bar', 'assets/graphics/general/loading_bar.png');

		//  This sets a limit on the up-scale

		//this.game.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurX.js');
    	//this.game.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurY.js');
	},

	create: function () {
		//this.loading_bar = this.game.add.spritte(300, 300, 'loading_bar');
		// This sets the loading_bar sprite as a loader sprite. What that does is automatically crop the sprite from 0 to full-width as the files below are loaded in.
		//this.game.load.setPreloadSprite(this.loading_bar);

		this.loading_text = this.game.add.text(32, 32, '0%', { fill: '#ffffff' });

		// We cannot start the loading immediately because the preloading from 'preload' just finished,
		// and if we start immediately they mess with each other :/
		this.game.time.events.add(1, this.startLoading, this);
	},

	startLoading: function () {
		console.log('Started Loading');

		this.game.load.onFileComplete.add(this.fileComplete, this);
		this.game.load.onLoadComplete.add(this.loadComplete, this);

		//this.game.load.pack('general', 'assets/assets.json', null, this);
		this.game.load.pack('dog', 'assets/assets.json', null, this);
		

		this.game.load.start();
	},

	fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
		console.log('File ' + cacheKey + ' loading ' + (success ? 'succeeded' : 'failed') + '. Total progress ' + progress + '% - ' + totalLoaded + ' out of ' + totalFiles);

		this.loading_text.setText(progress + '%');
	},

	loadComplete: function () {
		console.log('Load Complete');

		this.loading_text.setText('100%');

		// Large audio files like mp3's need to be decoded before they can be played.
		// In order to wait for decoding we will use the setDecodedCallback function.
		// It requires an array of audio objects, which we will create here.
		var audio_keys = this.game.cache.getKeys(Phaser.Cache.SOUND);
		var audio_objs = [];
		for (var i = audio_keys.length - 1; i >= 0; i--) {
			audio_objs.push(this.game.add.audio(audio_keys[i]));
		}
		this.game.sound.setDecodedCallback(audio_objs, this.decodeComplete, this);
	},

	decodeComplete: function () {
		this.game.state.start('Main');
	},
};

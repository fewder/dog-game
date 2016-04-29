PhaserGame.states.Main = function (game) {};

PhaserGame.states.Main.prototype = {
	create: function () {
		this.bus2 = this.game.add.image(200, 0, 'bus2');
		this.bus2.scale.setTo(3, 3);
		this.player = this.game.add.sprite(0, 360, 'pooch_run');
		this.bus1 = this.game.add.image(200, 0, 'bus1');
		this.bus1.scale.setTo(3, 3);
		this.player.scale.setTo(2, 2);
		this.anim = this.player.animations.add('run');
		this.anim.play(10, true);
	},
	update: function() {
		if (this.player.x < 440){
			this.player.x += 1;
		}
	}
};
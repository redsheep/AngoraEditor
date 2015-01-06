var game;
window.onload = function() {

	game = new Phaser.Game({w}, {h}, Phaser.AUTO, '');
	game.state.start('preload');
};